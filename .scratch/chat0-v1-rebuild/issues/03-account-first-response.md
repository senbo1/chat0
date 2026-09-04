# 03: Send and retain an account's first response

**What to build:** Let an account start a conversation from the blank composer and receive a streamed Gemini response. The user message and final assistant message become authoritative Convex history, while the streaming buffer remains local and disposable.

**Blocked by:** 02/Add Better Auth identity and account access.

**Status:** ready-for-agent

- [ ] The durable model stores conversations, immutable user and assistant messages, server-assigned sequence values, a synchronized conversation head, content activity time, and idempotent operation receipts.
- [ ] Persisted message parts are validated against the AI SDK shape and include status, model and finish metadata, and provider-reported token usage where available.
- [ ] The first send atomically creates the conversation, root user message, conversation head, sequence state, and generation operation for the authenticated account.
- [ ] After the first send, the URL is replaced with `/chat/[conversationId]` without adding a redundant blank-page history entry.
- [ ] The uncached Route Handler reconstructs the authoritative branch, adds the code-owned system prompt, and streams `gemini-3.6-flash` through the stateless Google GenerateContent provider with medium thinking and requested thought summaries.
- [ ] Zustand holds only the optimistic assistant message, stream parts, abort controller, and other non-persisted optimistic state.
- [ ] Normal completion inserts one immutable assistant message and advances the conversation head only from its expected user parent.
- [ ] Refreshing or opening the conversation on another account device loads the same durable messages and conversation head.
- [ ] The generation response is marked private and uncached, and automated tests cover retrying the first operation without duplicate data.
