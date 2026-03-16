---
name: surf
description: "Web search, web page fetching, and JS-rendered page retrieval skill. Trigger when the user asks to read a page, fetch URL content, scrape an SPA, or convert a web page to Markdown. Uses Claude Code's built-in WebSearch tool for web searches."
---

# surf - Web Fetching Skill

## Decision Flow

1. **Web search needed** → Use Claude Code's built-in `WebSearch` tool (no script required)
2. **Static web page** → Use `webread` script
3. **SPA / JS-rendered page** → Use `webrender` script (requires Lightpanda)

## Scripts

### webread - Static Page Fetching

Fetches HTML from a URL and converts it to clean Markdown using Readability + Turndown.

```bash
bun run ~/.claude/skills/surf/scripts/webread.ts <url> [--selector <css>]
```

**Arguments:**
- `<url>` - URL to fetch (required)
- `--selector <css>` / `-s <css>` - Extract only matching CSS elements (optional)

**Examples:**
```bash
# Convert an entire page to Markdown
bun run ~/.claude/skills/surf/scripts/webread.ts https://example.com

# Extract a specific element
bun run ~/.claude/skills/surf/scripts/webread.ts https://example.com --selector "article.main"
```

### webrender - JS-Rendered Page Fetching

Renders a page with Lightpanda (headless browser) via CDP, then converts the resulting HTML to Markdown. Designed for SPAs and JS-rendered content.

```bash
bun run ~/.claude/skills/surf/scripts/webrender.ts <url> [--selector <css>] [--wait-for <css>] [--timeout <ms>]
```

**Arguments:**
- `<url>` - URL to fetch (required)
- `--selector <css>` / `-s <css>` - Extract only matching elements (optional)
- `--wait-for <css>` / `-w <css>` - Wait until the specified selector appears (optional)
- `--timeout <ms>` / `-t <ms>` - Timeout in milliseconds (default: 30000)

**Examples:**
```bash
# Render and fetch an SPA page
bun run ~/.claude/skills/surf/scripts/webrender.ts https://spa-app.com

# Wait for content to load, then extract a specific element
bun run ~/.claude/skills/surf/scripts/webrender.ts https://spa-app.com --wait-for ".content-loaded" --selector ".main"
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SURF_CDP_URL` | CDP server WebSocket URL — base URL (`ws://127.0.0.1:9222`) or full endpoint (`ws://…/devtools/browser/xxx`). Base URLs are auto-resolved via `/json/version`. | `ws://127.0.0.1:9222` |

## Setup

Install dependencies (first time only):

```bash
cd ~/.claude/skills/surf && bun install
```

To use `webrender`, a CDP-compatible browser must be running on port 9222:

```bash
# Option 1: Chrome / Chromium
google-chrome --remote-debugging-port=9222 --headless
# or: chromium --remote-debugging-port=9222 --headless

# Option 2: Lightpanda (lightweight alternative)
lightpanda serve --host 127.0.0.1 --port 9222
```
