---
name: convex-dev-better-auth
description: Provides an integration layer for using Better Auth with Convex. Use this skill whenever working with Better Auth or related Convex component functionality.
version: 0.12.5
---

> Agents: read this skill fully before writing code that uses Better Auth. Follow the installation and configuration steps exactly.

# Better Auth

## Instructions

This component provides an integration layer for using Better Auth with Convex, enabling framework-agnostic authentication across React, Vue, Svelte, Next.js, and other popular frameworks. It handles email/password authentication, OAuth providers (GitHub, Google, Discord, Twitter), and multi-factor authentication while managing sessions and accounts through Convex's database.

### Installation

```bash
npm install @convex-dev/better-auth
```

Current npm version: `@convex-dev/better-auth@0.12.5`

## Use cases

- **Building a multi-framework app** where you need consistent authentication across React, Vue, Svelte, or other frontend frameworks using the same Convex backend
- **Adding social login** to your Convex app with support for GitHub, Google, Discord, Twitter, and other OAuth providers without managing provider-specific integration logic
- **Implementing secure user accounts** with email/password authentication, session management, and two-factor authentication using Convex for data persistence
- **Migrating from another auth solution** to Better Auth while keeping your existing Convex database schema and functions intact
- **Building SSR applications** with Next.js, Nuxt, or Astro that need server-side authentication handling integrated with your Convex backend

## How it works

The component acts as a bridge between Better Auth's authentication system and Convex's database and functions. Better Auth handles the authentication logic, session management, and OAuth provider integrations, while the component ensures all user data, sessions, and account information are stored and managed through your Convex backend.

The integration works by configuring Better Auth to use Convex functions for data persistence operations. When users sign up, sign in, or manage their accounts, Better Auth communicates with your Convex functions to store and retrieve user data, maintaining consistency with your existing Convex schema.

For multi-factor authentication and social sign-on, the component leverages Better Auth's built-in providers while ensuring all authentication state flows through Convex. This allows you to use Convex's real-time subscriptions and query capabilities with authenticated user data across any supported framework.

## When NOT to use

- When a simpler built-in solution exists for your specific use case
- If you are not using Convex as your backend
- When the functionality provided by Better Auth is not needed

## Resources

- [npm package](https://www.npmjs.com/package/%40convex-dev%2Fbetter-auth)
- [GitHub repository](https://github.com/get-convex/better-auth)
- [Live demo](https://labs.convex.dev/better-auth)
- [Convex Components Directory](https://www.convex.dev/components/better-auth)
- [Convex documentation](https://docs.convex.dev)