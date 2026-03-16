#!/usr/bin/env bun
import { htmlToMarkdown, extractWithSelector } from "../lib/html-to-md.js";

const USER_AGENT =
  "Mozilla/5.0 (compatible; surf-skills/1.0; +https://github.com/konaito/surf-skills)";

function usage(): never {
  console.error("Usage: webread <url> [--selector <css>]");
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) usage();

let url: string | undefined;
let selector: string | undefined;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--selector" || args[i] === "-s") {
    selector = args[++i];
  } else if (!args[i].startsWith("-")) {
    url = args[i];
  }
}

if (!url) usage();

try {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
  });

  if (!res.ok) {
    console.error(`HTTP ${res.status} ${res.statusText} for ${url}`);
    process.exit(1);
  }

  const html = await res.text();

  let md: string;
  if (selector) {
    const extracted = extractWithSelector(html, selector);
    if (!extracted) {
      console.error(`Selector "${selector}" matched no elements on ${url}`);
      process.exit(1);
    }
    md = extracted;
  } else {
    md = htmlToMarkdown(html, url);
  }

  console.log(`> Source: ${url}\n\n${md}`);
} catch (e) {
  const msg =
    e instanceof DOMException && e.name === "TimeoutError"
      ? `Timeout fetching ${url}`
      : `Failed to fetch ${url}: ${e instanceof Error ? e.message : String(e)}`;
  console.error(msg);
  process.exit(1);
}
