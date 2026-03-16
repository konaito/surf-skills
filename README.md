# surf-skills

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill that fetches web pages and converts them to clean Markdown. Supports both static pages and JavaScript-rendered SPAs.

## Features

- **`webread`** — Fetch static HTML pages and convert to Markdown using [Readability](https://github.com/mozilla/readability) + [Turndown](https://github.com/mixmark-io/turndown)
- **`webrender`** — Render JS-heavy pages via [Lightpanda](https://github.com/nicholasgasior/lightpanda) (headless browser) and convert to Markdown
- **CSS selector filtering** — Extract only the elements you need
- **Claude Code integration** — Works as a Claude Code skill with automatic trigger detection

## Installation

### As a Claude Code Skill

Clone this repository into your Claude Code skills directory:

```bash
git clone https://github.com/konaito/surf-skills.git ~/.claude/skills/surf
cd ~/.claude/skills/surf && bun install
```

Claude Code will automatically detect and load the skill from the `SKILL.md` file.

### Standalone

```bash
git clone https://github.com/konaito/surf-skills.git
cd surf-skills && bun install
```

## Usage

### webread — Static Page Fetching

Fetches HTML via `fetch()` and converts it to Markdown.

```bash
bun run scripts/webread.ts <url> [--selector <css>]
```

**Examples:**

```bash
# Convert a full page to Markdown
bun run scripts/webread.ts https://example.com

# Extract only the main article
bun run scripts/webread.ts https://example.com --selector "article.main"
```

### webrender — JS-Rendered Page Fetching

Connects to a Lightpanda (or any CDP-compatible) headless browser, renders the page with JavaScript, then converts to Markdown.

```bash
bun run scripts/webrender.ts <url> [--selector <css>] [--wait-for <css>] [--timeout <ms>]
```

**Options:**

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--selector` | `-s` | CSS selector to extract specific elements | *(entire page)* |
| `--wait-for` | `-w` | Wait until this selector appears before extracting | *(none)* |
| `--timeout` | `-t` | Timeout in milliseconds | `30000` |

**Examples:**

```bash
# Render an SPA and get the full page
bun run scripts/webrender.ts https://spa-app.com

# Wait for dynamic content, then extract a specific section
bun run scripts/webrender.ts https://spa-app.com --wait-for ".content-loaded" --selector ".main"
```

## Prerequisites

- [Bun](https://bun.sh/) runtime
- (For `webrender` only) A CDP-compatible headless browser such as [Lightpanda](https://github.com/nicholasgasior/lightpanda):

```bash
lightpanda serve --host 127.0.0.1 --port 9222
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SURF_CDP_URL` | CDP server WebSocket URL | `ws://127.0.0.1:9222` |

## How It Works

1. **webread**: Uses native `fetch()` to download HTML, then passes it through Mozilla's Readability for content extraction and Turndown for HTML-to-Markdown conversion.
2. **webrender**: Connects to a CDP headless browser via `puppeteer-core`, navigates to the URL, waits for network idle (and optionally a specific selector), then extracts the rendered HTML and converts it the same way.

Both scripts output the result to stdout, making them easy to pipe or capture.

## Project Structure

```
surf-skills/
├── SKILL.md              # Claude Code skill definition
├── package.json
├── lib/
│   └── html-to-md.ts     # Shared HTML → Markdown conversion
└── scripts/
    ├── webread.ts         # Static page fetcher
    └── webrender.ts       # JS-rendered page fetcher
```

## License

MIT
