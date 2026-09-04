# 05: Stop responses and recover from failures

**What to build:** Give the user a reliable Stop action and distinguish a deliberately kept partial response from a failed stream. A failed generation leaves its user message available for another attempt without turning transient stream state into durable history.

**Blocked by:** 03/Send and retain an account's first response.

**Status:** ready-for-agent

- [ ] Stop marks the generation operation as deliberately stopped before the client aborts the request.
- [ ] A deliberately stopped stream persists non-empty partial output as one immutable stopped response.
- [ ] An empty stopped stream persists no assistant message.
- [ ] Provider and network failures persist no assistant message and leave their error state local to the device.
- [ ] The existing user message can be used for another generation attempt without inserting a duplicate user message.
- [ ] A new send, edit, regeneration, fork, or variant selection cannot start while the device has a local stream in progress.
- [ ] Stream buffers and abort controllers are non-persisted and do not resume after refresh or on another device.
- [ ] Automated tests distinguish normal completion, deliberate Stop, empty Stop, client cancellation, provider failure, and network failure.
