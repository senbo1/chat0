# 06: Browse and delete account conversations

**What to build:** Give an account a synchronized conversation history sidebar with blank-conversation creation, conversation selection, and permanent whole-conversation deletion. History comes directly from authorized Convex subscriptions.

**Blocked by:** 03/Send and retain an account's first response.

**Status:** ready-for-agent

- [ ] The sidebar lists every conversation owned by the account and updates across devices through authenticated Convex client subscriptions.
- [ ] Conversations are ordered by content activity, newest first.
- [ ] Choosing New Conversation navigates to an unpersisted blank composer at `/chat`.
- [ ] Selecting a conversation navigates to `/chat/[conversationId]` and loads its synchronized active branch.
- [ ] Selecting a conversation or changing navigation state does not alter content activity ordering.
- [ ] Whole-conversation deletion requires confirmation and permanently removes owned messages and related operation data in bounded batches.
- [ ] Deleting a conversation aborts its local stream, and a late finalization cannot recreate or advance the deleted conversation.
- [ ] Search, folders, pinning, conversation renaming, and message-level deletion are not introduced.
- [ ] Private history is not loaded through a Server Component payload, route-prefetch cache, or public cache.
- [ ] Integration tests cover cross-device history updates, ordering, selection, blank conversations, and deletion during streaming.
