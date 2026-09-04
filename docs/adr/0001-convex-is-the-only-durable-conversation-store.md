# Convex is the only durable conversation store

Conversation history is stored only in Convex so every authorized client observes one authoritative history. Chat0 will not keep a second durable history in Dexie or Zustand. In v1, drafts and in-progress response buffers remain in non-persisted Zustand memory, so they do not survive refresh or resume on another device.

## Consequences

Convex's authorization-aware query cache and ephemeral client memory are allowed. Private conversation data must not enter Next.js, CDN, RSC, route-prefetch, AI Gateway, service worker, or durable browser caches. Cache Components are enabled for public and static UI, while partial prefetching remains disabled for v1.
