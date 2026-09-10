# Chat0

Chat0 is rebuilding its chat experience on Next.js App Router. The current slice provides the blank conversation shell, light and dark themes, the new-conversation shortcut, and the existing Markdown renderer.

## Requirements

- Node 22
- pnpm 11

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/chat`.

`pnpm dev` starts the local Convex backend, syncs `convex/`, then starts Next.js. Keep it running while developing. Convex is configured on this machine at `http://127.0.0.1:3210`, with HTTP actions at `http://127.0.0.1:3211`.

For a fresh checkout without a Convex account, initialize local development first:

```bash
CONVEX_AGENT_MODE=anonymous pnpm exec convex dev --once
pnpm dev
```

Convex writes the deployment settings and `NEXT_PUBLIC_CONVEX_URL` to `.env.local`. Local database state lives in `.convex/`. Both are ignored by Git. Restart Next.js if you change the deployment URL.

To run the servers in separate terminals, use `pnpm dev:convex` and `pnpm dev:web`. Run `pnpm exec convex dashboard` while the backend is running to inspect it.

Add tables in `convex/schema.ts` and backend functions in `convex/`. The app's `ConvexClientProvider` makes Convex hooks available to client components. Generated API types and managed AI guidance live in `convex/_generated/`.

Press `Ctrl+Shift+O` or `Command+Shift+O` to return to a blank conversation.

## Anonymous authentication

Authentication uses the [Convex Better Auth component](https://labs.convex.dev/better-auth/framework-guides/next) and Better Auth's [anonymous plugin](https://better-auth.com/docs/plugins/anonymous). Users and sessions live in the component's tables.

With the local Convex backend running, configure its environment once:

```bash
openssl rand -base64 32 | pnpm exec convex env set BETTER_AUTH_SECRET
pnpm exec convex env set SITE_URL http://localhost:3000
```

Set `NEXT_PUBLIC_CONVEX_SITE_URL=http://127.0.0.1:3211` in `.env.local` alongside `NEXT_PUBLIC_CONVEX_URL`. For hosted deployments, use the deployment's HTTP actions URL (ending in `.convex.site`) and set `SITE_URL` to the app's actual origin. Keep `BETTER_AUTH_SECRET` on the Convex backend only.

Client components can start a guest session explicitly:

```tsx
import { authClient } from '@/lib/auth-client';

const { data, error } = await authClient.signIn.anonymous();
// Handle error before continuing. Read the session with authClient.useSession().
```

The provider passes the session to Convex automatically. Backend functions can use `authComponent.getAuthUser(ctx)` from `convex/auth.ts` to require the current user and check ownership before accessing app data. Anonymous users have `isAnonymous: true`; the app does not create a guest account automatically on page load.

## Checks

```bash
pnpm check
pnpm build
```

For a hosted build, configure `NEXT_PUBLIC_CONVEX_URL` with a deployed Convex backend URL before building. The local development URL only works on this machine.
