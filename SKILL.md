---
name: surf
description: >
  Web page fetching and Markdown conversion. Fetches static pages via HTTP, renders SPA/JS-heavy pages via CDP.
  Uses Claude Code's built-in WebSearch tool for web searches.
  Use when user asks to "read this page", "fetch URL content", "scrape this SPA",
  "get the page content", or "convert a web page to Markdown".
---

# surf - Web Fetching Skill

## Instructions

### Step 1: Choose the right tool

- **Web search** → Use Claude Code's built-in `WebSearch` tool (no script needed)
- **Static page** → Use `webread` script
- **SPA / JS-rendered page** → Use `webrender` script (requires a CDP browser)

How to decide: If the page is built with React/Vue/Angular or generates content dynamically via JS, use `webrender`. Otherwise `webread` is sufficient.

### Step 2: Run the script

**Static page:**
```bash
bun run ~/.claude/skills/surf/scripts/webread.ts <url>
```

**JS-rendered page:**
```bash
bun run ~/.claude/skills/surf/scripts/webrender.ts <url>
```

To extract a specific element, add `--selector`:
```bash
bun run ~/.claude/skills/surf/scripts/webread.ts <url> --selector "article.main"
```

See `references/setup.md` for full argument reference.

### Step 3: Use the output

Scripts output Markdown to stdout. As needed:
- Save to file: append `> output.md` to the command
- Long pages are automatically truncated at 50,000 characters

## Examples

### Example 1: Fetch a documentation page

User: "Read this URL and summarize it"

1. Determine it's a static page → choose `webread`
2. `bun run ~/.claude/skills/surf/scripts/webread.ts https://docs.example.com/guide`
3. Read the Markdown output and return a summary

### Example 2: Fetch data from an SPA dashboard

User: "Get the content from this React app page"

1. Determine it's a SPA/JS-rendered page → choose `webrender`
2. Verify a CDP browser is running (if not, follow `references/setup.md`)
3. `bun run ~/.claude/skills/surf/scripts/webrender.ts https://app.example.com --wait-for ".content-loaded"`
4. Return the Markdown output

### Example 3: Extract a specific section

User: "Get just the main content from this page"

1. `bun run ~/.claude/skills/surf/scripts/webread.ts https://blog.example.com/post --selector "article"`

## Common Issues

### webread returns raw HTML tags

Cause: The page generates content dynamically via JavaScript.
Fix: Switch to `webrender`.

### webrender shows "Cannot connect to CDP server"

Cause: No CDP browser is running.
Fix:
1. Check with `curl http://127.0.0.1:9222/json/version`
2. If not running, start a CDP browser per `references/setup.md`
3. If using a different port, set `SURF_CDP_URL=ws://127.0.0.1:<port>`

### Selector matches nothing

Cause: Page structure doesn't match the selector.
Fix:
1. First fetch without `--selector` to see the full structure
2. Use browser DevTools to find the correct selector
3. Re-run with the corrected `--selector`

### Content is truncated

Cause: Hit the 50,000 character limit.
Fix: Use `--selector` to extract only the needed section, or fetch in multiple passes.

## References

- `scripts/webread.ts` - Static page fetcher (HTTP fetch + Readability + Turndown)
- `scripts/webrender.ts` - JS-rendered page fetcher (Puppeteer CDP connection)
- `lib/html-to-md.ts` - HTML-to-Markdown conversion library
- `references/setup.md` - First-time setup, environment variables, argument reference
