# 14: Permanently delete an account

**What to build:** Let an account permanently delete itself after explicit confirmation. Remove all owned conversation data before deleting the Better Auth account, without allowing in-progress or late generation work to restore data.

**Blocked by:** 09/Transfer a guest conversation on sign-in; 12/Fork an independent conversation.

**Status:** ready-for-agent

- [ ] The account menu offers permanent account deletion behind an explicit confirmation step.
- [ ] Deletion aborts every local stream owned by the account before durable cleanup begins.
- [ ] All owned conversations, copied fork messages, transferred guest messages, and related operation data are removed in bounded Convex batches.
- [ ] Late generation and title finalization cannot recreate deleted data or advance a deleted conversation head.
- [ ] The Better Auth account is deleted only after its Convex conversation data has been removed successfully.
- [ ] Interrupted deletion can resume safely without duplicating work or leaving the account falsely reported as deleted.
- [ ] Other devices lose access and converge on the deleted account state.
- [ ] Data owned by another account is never removed.
- [ ] Integration tests cover deletion with many messages, transferred conversations, forks, active streams, interrupted cleanup, and another account's data.
