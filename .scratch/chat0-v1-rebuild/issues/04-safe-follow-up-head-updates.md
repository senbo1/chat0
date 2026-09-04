# 04: Send follow-up prompts with safe head updates

**What to build:** Let an account continue a conversation from its synchronized conversation head while preserving every valid concurrent operation. The server, not the client, decides the model context and whether a completed response may become the new head.

**Blocked by:** 03/Send and retain an account's first response.

**Status:** ready-for-agent

- [ ] Each follow-up send uses only the ancestry of the authoritative conversation head as model history.
- [ ] The root is always a user message, roles alternate on every path, and system messages are never persisted.
- [ ] Retrying an operation ID cannot duplicate a user message, assistant message, or head update.
- [ ] Concurrent sends from the same expected head persist as ordered user variants with immutable server sequence values.
- [ ] A late assistant response is persisted but advances the conversation head only when its expected user parent is still the head.
- [ ] Content-producing sends update content activity time; navigation-only state changes do not.
- [ ] Persisted messages are rejected before exceeding Convex's document ceiling.
- [ ] A branch that exceeds Gemini's context window is rejected explicitly and is never silently truncated.
- [ ] Chat0 adds no product-specific account rate limit or arbitrary prompt-size cap in this slice.
- [ ] Integration tests cover multi-turn context, duplicate operations, and two concurrent sends that complete out of order.
