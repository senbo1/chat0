import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headersList = await headers();
  const googleApiKey = headersList.get("X-Google-API-Key");
  const openaiApiKey = headersList.get("X-OpenAI-API-Key");
  const openrouterApiKey = headersList.get("X-OpenRouter-API-Key");

  const { prompt, isTitle, messageId, threadId } = await req.json();

  let model;

  if (googleApiKey) {
    const google = createGoogleGenerativeAI({
      apiKey: googleApiKey,
    });
    model = google("gemini-2.5-flash-preview-04-17");
  } else if (openaiApiKey) {
    const openai = createOpenAI({
      apiKey: openaiApiKey,
    });
    model = openai("gpt-4.1-mini");
  } else if (openrouterApiKey) {
    const openrouter = createOpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: openrouterApiKey,
    });
    model = openrouter("deepseek/deepseek-chat-v3-0324:free");
  } else {
    return NextResponse.json(
      {
        error:
          "At least one API key is required to enable chat title generation.",
      },
      { status: 400 }
    );
  }

  try {
    const { text: title } = await generateText({
      model,
      system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - you should NOT answer the user's message, you should only generate a summary/title
      - do not use quotes or colons`,
      prompt,
    });

    return NextResponse.json({ title, isTitle, messageId, threadId });
  } catch (error) {
    console.error("Failed to generate title:", error);
    return NextResponse.json(
      { error: "Failed to generate title" },
      { status: 500 }
    );
  }
}
