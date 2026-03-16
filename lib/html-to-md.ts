import { parseHTML } from "linkedom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";

const MAX_LENGTH = 50000;

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export function htmlToMarkdown(html: string, url: string): string {
  const { document } = parseHTML(html);

  // Try Readability first for clean article extraction
  const reader = new Readability(document as unknown as Document, {
    charThreshold: 0,
  });
  const article = reader.parse();

  const content = article?.content ?? document.body?.innerHTML ?? html;
  const title = article?.title ?? "";

  let md = turndown.turndown(content);
  if (title) {
    md = `# ${title}\n\n${md}`;
  }

  if (md.length > MAX_LENGTH) {
    md = md.slice(0, MAX_LENGTH) + `\n\n---\n*(Truncated at ${MAX_LENGTH} characters)*`;
  }

  return md;
}

export function extractWithSelector(
  html: string,
  selector: string
): string | null {
  const { document } = parseHTML(html);
  const el = document.querySelector(selector);
  if (!el) return null;
  return turndown.turndown(el.outerHTML);
}
