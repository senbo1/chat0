# 11: Edit and navigate user variants

**What to build:** Let an account edit a user message by creating a new immutable variant and starting a new assistant response beneath it. Keep every previous message path available through user variant navigation.

**Blocked by:** 10/Regenerate and navigate assistant variants.

**Status:** ready-for-agent

- [ ] Saving an edit inserts a new user sibling with the same preceding message, or another root user variant when editing the root.
- [ ] The original user message and all existing descendants remain unchanged.
- [ ] The edited user variant becomes the parent of a newly streamed assistant response.
- [ ] Edit and generation retries are idempotent and cannot duplicate the user or assistant message.
- [ ] User messages with siblings show n/m controls ordered by immutable server sequence, oldest first.
- [ ] Selecting a user variant synchronizes the conversation head and follows newest descendants to a leaf.
- [ ] The next model request includes the edited active branch and excludes the superseded branch.
- [ ] Editing requires an account and remains disabled during a local stream.
- [ ] Tests cover root and non-root edits, preserved descendants, variant ordering, selection, failed generation after an edit, and cross-device synchronization.
