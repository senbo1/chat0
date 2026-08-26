# 09: Transfer a guest conversation on sign-in

**What to build:** Preserve the current guest conversation when the guest signs in with Google. Transfer ownership into either a new or existing account before removing the guest identity.

**Blocked by:** 08/Enforce one guest allowance.

**Status:** ready-for-agent

- [ ] Linking to a new account transfers the guest conversation, messages, conversation head, title state, and related operation data to that account.
- [ ] Linking to an existing account preserves its prior history and adds the transferred conversation to it.
- [ ] Transfer completes before the guest identity is removed or loses access.
- [ ] A failed transfer leaves the guest identity and conversation usable for a safe retry.
- [ ] Retrying the link flow cannot duplicate the conversation or messages.
- [ ] The current conversation route remains valid after successful transfer.
- [ ] The transferred conversation appears in account history and supports account-only follow-up actions.
- [ ] Other identities cannot observe or claim the guest conversation during transfer.
- [ ] Integration tests cover new-account linking, existing-account linking, interrupted transfer, and idempotent retry.
