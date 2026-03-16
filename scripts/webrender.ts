#!/usr/bin/env bun
import puppeteer from "puppeteer-core";
import { htmlToMarkdown, extractWithSelector } from "../lib/html-to-md.js";

const DEFAULT_CDP_URL = "ws://127.0.0.1:9222";
const DEFAULT_TIMEOUT = 30000;

function usage(): never {
  console.error(
    "Usage: webrender <url> [--selector <css>] [--wait-for <css>] [--timeout <ms>]"
  );
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) usage();

let url: string | undefined;
let selector: string | undefined;
let waitFor: string | undefined;
let timeout = DEFAULT_TIMEOUT;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--selector" || args[i] === "-s") {
    selector = args[++i];
  } else if (args[i] === "--wait-for" || args[i] === "-w") {
    waitFor = args[++i];
  } else if (args[i] === "--timeout" || args[i] === "-t") {
    timeout = parseInt(args[++i], 10);
  } else if (!args[i].startsWith("-")) {
    url = args[i];
  }
}

if (!url) usage();

const cdpUrl = process.env.SURF_CDP_URL ?? DEFAULT_CDP_URL;

let browser;
try {
  browser = await puppeteer.connect({ browserWSEndpoint: cdpUrl });
} catch {
  console.error(
    `Cannot connect to CDP server at ${cdpUrl}.\nStart Lightpanda with: lightpanda serve --host 127.0.0.1 --port 9222`
  );
  process.exit(1);
}

try {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout,
  });

  if (waitFor) {
    await page.waitForSelector(waitFor, { timeout });
  }

  const html = await page.content();
  await context.close();

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

  console.log(`> Source: ${url} (JS rendered)\n\n${md}`);
} catch (e) {
  console.error(
    `Render failed: ${e instanceof Error ? e.message : String(e)}`
  );
  process.exit(1);
} finally {
  browser.disconnect();
}
