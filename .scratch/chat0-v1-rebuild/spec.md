# Chat0 v1 rebuild

Status: awaiting confirmation

## Goal

Rebuild Chat0 on Next.js 16.3 App Router, Convex, AI SDK 7, and Zustand. Remove React Router and Dexie. Preserve the existing chat experience while adding immutable branching, variant navigation, and conversation forking.

## Product boundary

V1 includes:

- guest access with one user prompt and one assistant response per anonymous identity
- Google sign-in and multi-device conversation history
- new conversations, history sidebar, conversation selection, and permanent conversation deletion
- streaming responses, Stop, errors, and generated conversation titles
- copy, user-message editing, assistant regeneration, n/m variant navigation, and fork to a new conversation
- visible Gemini thought summaries
- Markdown with GFM, math, syntax highlighting, code copy, themes, and the existing keyboard shortcut
- the existing block-level Markdown memoization strategy

V1 excludes:

- settings, BYOK, provider selection, and model selection
- the AI-summary Chat Navigator and per-message summaries
- attachments, images, tools, sources, citations, and custom data parts
- history search, folders, pinning, conversation renaming, and message-level deletion
- resumable or cross-device in-progress streams
- persisted drafts
- migration of existing Dexie history

## Technical baseline

- Use the latest secure Next.js 16.3 patch, React 19, TypeScript, and Node 22.
- Deploy on Vercel.
- Use AI SDK 7, `@ai-sdk/react` 4, and `@ai-sdk/google` 4.
- Use Convex as the only durable conversation store.
- Use Zustand only for non-persisted drafts, streaming buffers, abort controllers, and optimistic UI state.
- Use assistant-ui as a behavioral reference, not a runtime dependency.
- Remove React Router, Dexie, OpenNext, and Cloudflare deployment configuration.

## Routes and navigation

- `/` redirects to `/chat`.
- `/chat` renders an unpersisted blank composer in guest or account mode.
- The first send atomically creates the conversation and first user message, then replaces the URL with `/chat/[conversationId]`.
- Forking creates the copied conversation and navigates to it immediately.
- The history sidebar orders account conversations by content activity. Merely selecting a variant does not reorder history.
- A guest sees only the current conversation and a Google sign-in action.

## Identity and ownership

- Use Better Auth with its Convex component and anonymous plugin.
- Google is the only permanent sign-in method in v1.
- Create an anonymous identity only when a guest first sends.
- Derive ownership from the authenticated Better Auth identity in every Convex function and Route Handler. Never accept an owner ID from the client.
- Atomically consume one guest allowance with the first user message. Further sends, edits, regeneration, and forks require sign-in.
- A deliberately stopped response consumes the guest allowance.
- A verified provider failure may retry the same guest prompt. Client cancellation does not restore the allowance.
- On sign-in, transfer the guest conversation into the new or existing account before removing the anonymous identity.
- Guest conversations do not expire automatically in v1.
- Deleting a guest conversation does not restore its consumed allowance.
- The account menu contains Google sign-in where applicable, sign out, and permanent account deletion with confirmation.

## Persisted model

### Conversations

A conversation stores its owner, generated title, synchronized `headMessageId`, next sequence number, creation time, and content activity time.

### Messages

Each message is a separate immutable Convex document containing:

- `conversationId`
- `parentId`, absent only for a root user message
- server-assigned `sequence`
- `role`, either `user` or `assistant`
- validated AI SDK `parts`
- status, either `complete` or `stopped`
- model and finish metadata where applicable
- token usage where the provider reports it
- creation time and idempotent operation ID

The root is always a user message. User and assistant roles alternate along every path. System messages are not persisted.

Same-parent messages are ordered variants. Order by immutable sequence, oldest first, so a newly created variant appears as `m/m`.

Recommended indexes:

- conversations by owner and content activity
- messages by conversation and sequence
- messages by conversation, parent, and sequence
- operation receipts by owner and operation ID
- guest allowances by anonymous identity

## Active branch and variants

- The ancestry of `headMessageId` is the active branch and the only history sent to the chat model.
- The conversation head is synchronized through Convex across devices.
- Selecting a variant updates only the conversation head.
- If the selected variant has descendants, follow the newest child at each later branch point until reaching a leaf.
- Editing a user message inserts an edited sibling and starts a new assistant response beneath it. Existing descendants remain unchanged.
- Regenerating an assistant message creates an assistant sibling with the same parent. Existing responses remain unchanged.
- N/m controls appear on any user or assistant message with siblings.
- During a local stream, disable editing, regeneration, forking, variant switching, and additional sends until completion or Stop.

Concurrent sends from the same head survive as user variants. Server sequence determines their order. A late assistant response is persisted but advances the conversation head only if its expected parent is still the head.

## Forking

- Allow an account to fork from a user or assistant message.
- Copy the active path through the selected message into a new conversation using new message IDs.
- Set the copied selected message as the new conversation head.
- Do not share message documents between conversations.
- Generate a new title for the fork.

## Models

- Chat model: `gemini-3.6-flash` through the stateless Google GenerateContent provider.
- Title model: `gemini-3.1-flash-lite`.
- Keep model IDs and the system prompt in server code.
- Keep `GOOGLE_GENERATIVE_AI_API_KEY` in Vercel environment variables.
- Do not use provider-side conversation state or Gemini cached content.
- Use medium thinking and request provider-returned thought summaries.
- Persist text and reasoning-summary parts. Do not describe them as hidden chain-of-thought.
- Send only the first user message to the title model. Request a short plain-text title with no Markdown or decorative punctuation.
- Generate the title once after the first complete or stopped assistant message. Use a truncated first prompt while generation is pending or if it fails.

V1 defines no Chat0-specific account rate limit or arbitrary prompt-size cap. Validate persisted messages against Convex's document ceiling and reject a branch that exceeds Gemini's context window. Never truncate conversation history silently. Provider and platform limits still apply.

## Streaming and mutation flow

1. The client sends the new prompt, selected conversation head, and operation ID to an authenticated, uncached `POST` Route Handler.
2. A Convex mutation authorizes the identity, consumes the guest allowance when needed, inserts the user message, advances the head, and records the generation operation atomically.
3. The Route Handler reconstructs the authoritative active branch from Convex, validates its AI SDK messages, adds the code-owned system prompt, and starts Gemini streaming.
4. Zustand holds the optimistic assistant message and incoming stream parts only in memory.
5. On normal completion, a Convex mutation inserts one immutable assistant message and conditionally advances the head.
6. On user Stop, Chat0 marks the operation as deliberately stopped before aborting. The server persists any non-empty partial output as a stopped response.
7. On provider or network failure, Chat0 persists no assistant message. The user message remains available for regeneration after sign-in.

Use operation IDs and atomic Convex mutations so retries cannot duplicate user messages, assistant messages, forks, or guest allowance consumption.

## Cache boundary

- Enable `cacheComponents: true`.
- Leave `partialPrefetching` disabled in v1.
- Cache only public and static UI.
- Load private conversation history through authenticated Convex client subscriptions inside Client Components.
- Do not place conversation data in `use cache`, `use cache: private`, RSC payload preloads, route-prefetch caches, CDN caches, service workers, AI Gateway caches, or durable Zustand storage.
- Mark generation and title responses `private, no-store`.
- Convex's authorization-aware query cache and ephemeral React memory are allowed.

## Markdown rendering

Preserve the existing renderer's streaming optimization:

- split Markdown into top-level blocks with `marked.lexer`
- memoize the block list by complete message content
- memoize each rendered block by its own content
- keep stable message-and-block keys so completed blocks do not rerender while the final block streams

Retain GFM, KaTeX, highlighted code, code-copy controls, and light and dark themes.

## Deletion

- V1 supports whole-conversation deletion only.
- Conversation and account deletion permanently remove owned messages in bounded Convex batches.
- Deleting a conversation aborts its local stream and prevents late finalization from recreating it.
- Account deletion removes all owned conversations and the Better Auth account after confirmation.

## Acceptance criteria

- No React Router, Dexie, OpenNext, or Cloudflare runtime dependency remains.
- Refreshing or opening another signed-in device loads the same Convex history and conversation head.
- Editing and regeneration preserve previous variants and expose correct n/m navigation.
- Forking produces independent copied messages and does not affect the source conversation.
- A guest can complete exactly one prompt under one anonymous identity, refresh the page, and retain that conversation.
- Linking a guest to a new or existing Google account preserves the guest conversation.
- Private conversation content never enters a Next.js or durable browser cache.
- Stopping preserves non-empty partial output; connection or provider failure does not.
- Streaming Markdown does not rerender completed blocks when only the final block changes.
- Production builds and authenticated streaming work on Vercel.

## Post-v1 discussions

- inactive and orphaned guest retention cleanup
- account, IP, concurrency, and global spending rate limits
- persisted per-conversation drafts
