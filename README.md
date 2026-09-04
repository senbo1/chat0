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

Press `Ctrl+Shift+O` or `Command+Shift+O` to return to a blank conversation.

## Checks

```bash
pnpm check
pnpm build
```

Vercel can deploy the application with its standard Next.js build settings.
