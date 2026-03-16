# Setup & Configuration

## First-time setup

```bash
cd ~/.claude/skills/surf && bun install
```

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SURF_CDP_URL` | CDP server WebSocket URL — base URL (`ws://127.0.0.1:9222`) or full endpoint (`ws://…/devtools/browser/xxx`). Base URLs are auto-resolved via `/json/version`. | `ws://127.0.0.1:9222` |

## Starting a CDP browser for webrender

The `webrender` script requires a CDP-compatible browser running on port 9222.

```bash
# Option 1: Chrome / Chromium
google-chrome --remote-debugging-port=9222 --headless
# or: chromium --remote-debugging-port=9222 --headless

# Option 2: Lightpanda (lightweight alternative)
lightpanda serve --host 127.0.0.1 --port 9222
```

## Script argument reference

### webread

```
webread <url> [--selector <css>]
```

- `<url>` - URL to fetch (required)
- `--selector <css>` / `-s <css>` - Extract only matching CSS elements (optional)

### webrender

```
webrender <url> [--selector <css>] [--wait-for <css>] [--timeout <ms>]
```

- `<url>` - URL to fetch (required)
- `--selector <css>` / `-s <css>` - Extract only matching elements (optional)
- `--wait-for <css>` / `-w <css>` - Wait until the specified selector appears (optional)
- `--timeout <ms>` / `-t <ms>` - Timeout in milliseconds (default: 30000)
