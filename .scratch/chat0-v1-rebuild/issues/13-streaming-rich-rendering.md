# 13: Preserve rich rendering during streams

**What to build:** Render streamed and durable assistant content with the existing rich Markdown behavior and visible Gemini thought summaries. Completed Markdown blocks must remain stable while only the unfinished final block changes.

**Blocked by:** 03/Send and retain an account's first response.

**Status:** ready-for-agent

- [ ] Provider-returned thought summaries appear as visible reasoning-summary content and are never described as hidden chain-of-thought.
- [ ] Text and reasoning-summary parts render the same way from a local stream and from persisted Convex history.
- [ ] Markdown supports GFM, KaTeX math, syntax-highlighted code, code-copy controls, and light and dark themes.
- [ ] User and assistant text can be copied through message controls.
- [ ] Markdown is split into top-level blocks with `marked.lexer`.
- [ ] The block list is memoized by complete message content, and each rendered block is memoized by its own content.
- [ ] Stable message and block keys prevent completed blocks from rerendering when only the final streaming block changes.
- [ ] Renderer tests count completed-block renders across incremental stream updates and cover GFM, math, highlighted code, copy, themes, and thought summaries.
