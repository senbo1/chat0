# 07: Generate stable conversation titles

**What to build:** Give each conversation one model-generated title based on its first user message. Generate it only after the first durable assistant response, while showing a useful fallback before generation succeeds.

**Blocked by:** 05/Stop responses and recover from failures; 06/Browse and delete account conversations.

**Status:** ready-for-agent

- [ ] Title generation starts once after the first complete or stopped assistant response becomes durable.
- [ ] Only the first user message is sent to `gemini-3.1-flash-lite` for title generation.
- [ ] The title prompt requests short plain text without Markdown or decorative punctuation.
- [ ] A truncated first prompt appears while generation is pending and remains as the fallback if generation fails.
- [ ] Retrying title work cannot create multiple title generations or replace a title that already succeeded.
- [ ] Editing, regeneration, variant selection, and ordinary follow-up messages do not change the conversation title.
- [ ] Title generation and responses are private and uncached.
- [ ] Updating a title does not change the conversation's content activity ordering.
- [ ] Tests cover complete and stopped first responses, pending and failed generation, idempotent retry, and stable titles after later activity.
