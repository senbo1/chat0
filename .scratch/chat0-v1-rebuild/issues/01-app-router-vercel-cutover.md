# 01: Cut over to App Router and Vercel

**What to build:** Run Chat0 as a Next.js 16.3 App Router application on the Vercel runtime. Preserve the recognizable blank conversation shell, themes, Markdown presentation, and new-conversation keyboard shortcut while removing legacy features and runtime integrations that are outside v1.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] The project uses the latest secure Next.js 16.3 patch, React 19, TypeScript, and Node 22.
- [x] `/` redirects to `/chat`, and `/chat` renders an unpersisted blank composer without creating a conversation.
- [x] App Router owns navigation and layout rendering without a client-side router.
- [x] Cache Components are enabled and partial prefetching remains disabled.
- [x] The light and dark themes and the existing new-conversation keyboard shortcut still work.
- [x] Settings, BYOK, provider selection, model selection, the Chat Navigator, and per-message summaries are absent.
- [x] React Router, Dexie, OpenNext, Cloudflare runtime dependencies, scripts, and deployment configuration are removed.
- [x] The application passes its automated checks and a production build for the Vercel target.

## Answer

Implemented in commit `8d6c3b1`. Chat0 now runs on Next.js 16.3 App Router with the blank `/chat` shell, themes, Markdown rendering, and the new-conversation shortcut. The old browser router, local database, provider settings, and Cloudflare deployment path are gone.
