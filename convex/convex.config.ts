import betterAuth from '@convex-dev/better-auth/convex.config';
import { defineApp } from 'convex/server';

const app = defineApp();
app.use(betterAuth);

export default app;
