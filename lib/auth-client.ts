import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { anonymousClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  plugins: [anonymousClient(), convexClient()],
});
