import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createLiteLLM } from '@/lib/providers/litellm';
import { generateText } from 'ai';
import { headers } from 'next/headers';
import { getModelConfig, AIModel } from '@/lib/models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages, model, prompt, isTitle, messageId, threadId } =
    await req.json();
  const headersList = await headers();

  const modelConfig = getModelConfig(model as AIModel);

  const apiKey = headersList.get(modelConfig.headerKey) as string;

  let aiModel;
  switch (modelConfig.provider) {
    case 'google':
      const google = createGoogleGenerativeAI({ apiKey });
      aiModel = google(modelConfig.modelId);
      break;

    case 'openai':
      const openai = createOpenAI({ apiKey });
      aiModel = openai(modelConfig.modelId);
      break;

    case 'openrouter':
      const openrouter = createOpenRouter({ apiKey });
      aiModel = openrouter(modelConfig.modelId);
      break;

    case 'litellm':
      const baseURL =
        headersList.get('X-LiteLLM-Base-Url') ??
        process.env.LITELLM_BASE_URL;
      const litellm = createLiteLLM({
        apiKey,
        baseURL: baseURL || undefined,
      });
      aiModel = litellm(modelConfig.modelId);
      break;

    default:
      return new Response(
        JSON.stringify({ error: 'Unsupported model provider' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
  }

  try {
    const { text: title } = await generateText({
      model: aiModel,
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
    console.error('Failed to generate title:', error);
    return NextResponse.json(
      { error: 'Failed to generate title' },
      { status: 500 }
    );
  }
}
