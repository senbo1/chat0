# 12: Fork an independent conversation

**What to build:** Let an account fork from any user or assistant message on the active branch. The fork opens immediately as a new conversation whose copied messages, conversation head, and title lifecycle are independent of the source.

**Blocked by:** 07/Generate stable conversation titles; 11/Edit and navigate user variants.

**Status:** ready-for-agent

- [ ] Forking is available for both user and assistant messages and requires an account.
- [ ] The fork copies the active path from its root through the selected message and copies no later message.
- [ ] Every copied message receives a new ID and belongs only to the new conversation.
- [ ] The copied selected message becomes the new conversation head.
- [ ] The fork operation is atomic and idempotent, so retry cannot create duplicate conversations or messages.
- [ ] Chat0 navigates to the new conversation as soon as the fork succeeds.
- [ ] The fork receives its own title according to the stable title lifecycle rather than sharing the source title record.
- [ ] Editing, regenerating, selecting variants, or deleting either conversation cannot alter the other.
- [ ] Forking remains disabled during a local stream.
- [ ] Tests cover forks from both roles, forks from an alternate branch, idempotent retry, independent changes, and deletion on either side.
