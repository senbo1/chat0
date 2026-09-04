# 08: Enforce one guest allowance

**What to build:** Let a guest create and retain one conversation containing one user prompt and its assistant response. Enforce the guest allowance atomically, and require Google sign-in before any later content-producing action.

**Blocked by:** 04/Send follow-up prompts with safe head updates; 05/Stop responses and recover from failures; 06/Browse and delete account conversations.

**Status:** ready-for-agent

- [ ] A guest identity is created only when the guest first sends a prompt.
- [ ] The first user message and guest-allowance consumption happen atomically for that guest identity.
- [ ] The guest conversation and synchronized conversation head survive refresh in the same browser.
- [ ] A guest sees only the current conversation and a Google sign-in action, not account conversation history.
- [ ] Further sends, edits, regeneration, and forks require an account after the allowance is consumed.
- [ ] A deliberately stopped response consumes the allowance, including when no assistant content is persisted.
- [ ] A verified provider failure may retry the same guest prompt without granting a new prompt or inserting another user message.
- [ ] Client cancellation does not restore the allowance.
- [ ] Deleting the guest conversation does not restore its allowance, and guest conversations do not expire automatically in v1.
- [ ] Authorization always derives guest ownership from Better Auth rather than client input.
- [ ] Integration tests cover normal completion, refresh, Stop, provider failure retry, cancellation, deletion, and every gated action.
