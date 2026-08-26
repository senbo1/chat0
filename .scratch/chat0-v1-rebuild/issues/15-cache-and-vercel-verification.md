# 15: Verify private caching and Vercel production

**What to build:** Audit the completed v1 flow against its privacy and deployment boundaries, then prove the production build can authenticate and stream on Vercel without legacy runtime dependencies or durable client copies of conversation data.

**Blocked by:** 13/Preserve rich rendering during streams; 14/Permanently delete an account.

**Status:** ready-for-agent

- [ ] Only public and static UI uses Cache Components.
- [ ] Private conversation history loads through authorized Convex client subscriptions and never enters a Next.js cache, RSC preload, route-prefetch cache, CDN cache, service worker, or AI Gateway cache.
- [ ] Zustand has no persistence for drafts, streaming buffers, abort controllers, or optimistic state.
- [ ] Generation and title handlers authenticate every request and return `private, no-store` cache policy.
- [ ] Model IDs, the system prompt, and provider credentials remain server-owned, with `GOOGLE_GENERATIVE_AI_API_KEY` supplied through Vercel environment configuration.
- [ ] Chat generation uses no provider-side conversation state, Gemini cached content, or second durable conversation store.
- [ ] Dependency and configuration checks find no React Router, Dexie, OpenNext, or Cloudflare runtime integration.
- [ ] Automated privacy checks cover navigation, prefetching, refresh, account switching, and durable browser storage.
- [ ] The full test suite and production build pass on Node 22 with the latest secure Next.js 16.3 patch.
- [ ] A Vercel smoke test verifies Google sign-in, first send, streaming, Stop, refresh, and private response headers.
