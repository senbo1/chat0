# 02: Add Better Auth identity and account access

**What to build:** Let a person sign in to an account with Google and sign out through Better Auth backed by its Convex component. Configure guest support without creating a guest identity merely because someone visited Chat0.

**Blocked by:** 01/Cut over to App Router and Vercel.

**Status:** ready-for-agent

- [ ] Better Auth uses its Convex component and anonymous plugin, with Google as the only permanent sign-in method.
- [ ] The account menu offers Google sign-in when applicable and sign-out for an account.
- [ ] A returning account session is recognized across refreshes and devices.
- [ ] Visiting `/chat` as a guest does not create a guest identity; identity creation remains deferred until the first send.
- [ ] Server authorization derives identity from Better Auth and does not accept an owner identifier supplied by the client.
- [ ] Authentication failures expose a useful, non-sensitive error and do not create conversation data.
- [ ] Automated tests cover account access, sign-out, and the lazy guest-identity boundary.
