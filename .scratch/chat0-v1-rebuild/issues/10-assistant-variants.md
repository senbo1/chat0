# 10: Regenerate and navigate assistant variants

**What to build:** Let an account regenerate an assistant message without replacing prior responses. Show assistant variants in sequence order and synchronize selection by updating the conversation head.

**Blocked by:** 04/Send follow-up prompts with safe head updates; 06/Browse and delete account conversations.

**Status:** ready-for-agent

- [ ] Regeneration appends an immutable assistant sibling with the same user parent and leaves existing responses and descendants unchanged.
- [ ] Regeneration uses an idempotent operation ID and cannot duplicate an assistant variant on retry.
- [ ] Assistant messages with siblings show n/m controls ordered by immutable server sequence, oldest first.
- [ ] A newly regenerated assistant response appears as m/m.
- [ ] Selecting a variant changes only the synchronized conversation head and does not update content activity time.
- [ ] When the selected variant has descendants, selection follows the newest child at each later branch point until reaching a leaf.
- [ ] Another device observes the selected active branch through Convex synchronization.
- [ ] The next model request uses the newly selected active branch and excludes inactive variants.
- [ ] Regeneration and variant selection remain disabled during a local stream and require an account.
- [ ] Tests cover sibling ordering, newest-descendant traversal, cross-device selection, idempotent regeneration, and unchanged history ordering.
