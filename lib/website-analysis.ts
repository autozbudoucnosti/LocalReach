import * as cheerio from "cheerio";
import { normalizeOptionalUrl, truncate } from "@/lib/utils";

export type WebsiteAnalysisResult = {
  normalizedUrl: string;
  homepageTitle: string | null;
  metaDescription: string | null;
  detectedIssues: string[];
  summary: string;
  rawHtmlSnippet: string | null;
};

const CTA_PATTERNS =
  /(contact|call|book|schedule|quote|estimate|appointment|consult|learn more|get started|request)/i;
const CONTACT_PATTERNS = /(contact|call|email|phone|visit us)/i;

export async function analyzeWebsiteHomepage(url: string): Promise<WebsiteAnalysisResult> {
  const normalizedUrl = normalizeOptionalUrl(url);

  if (!normalizedUrl) {
    throw new Error("A valid website URL is required before running analysis.");
  }

  const response = await fetch(normalizedUrl, {
    headers: {
      "user-agent": "LocalReachMVP/1.0 (+https://localhost)",
      accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(12000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Website returned ${response.status} ${response.statusText}.`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $("title").first().text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    null;
  const hasViewport = $('meta[name="viewport"]').length > 0;
  const textContent = $("body").text().replace(/\s+/g, " ").trim();

  const issues: string[] = [];

  if (!title) {
    issues.push("Homepage is missing a page title.");
  }

  if (!metaDescription) {
    issues.push("Homepage has no meta description.");
  }

  if (!hasViewport) {
    issues.push("Homepage is missing a mobile viewport meta tag.");
  }

  const hasContactSignals =
    CONTACT_PATTERNS.test(textContent) ||
    $('a[href^="mailto:"]').length > 0 ||
    $('a[href^="tel:"]').length > 0;

  if (!hasContactSignals) {
    issues.push("Contact information does not appear easy to find on the homepage.");
  }

  const hasObviousCta =
    $("a, button")
      .toArray()
      .some((element) => CTA_PATTERNS.test($(element).text().replace(/\s+/g, " ").trim())) ||
    CTA_PATTERNS.test(textContent);

  if (!hasObviousCta) {
    issues.push("No obvious call to action was detected on the homepage.");
  }

  // These are intentionally rough heuristics for an MVP, not a full technical audit.
  const outdatedSignals = [
    /<font[\s>]/i.test(html),
    /<marquee[\s>]/i.test(html),
    /<table[\s>]/i.test(html) && $("nav, header, main, footer").length === 0,
    (html.match(/<br\s*\/?>/gi) ?? []).length > 30,
    !hasViewport,
  ].filter(Boolean).length;

  if (outdatedSignals >= 2) {
    issues.push("The site shows a few signs of being dated or not mobile-first.");
  }

  const summaryParts = [
    title ? `Title found: "${truncate(title, 80)}".` : "No homepage title found.",
    metaDescription ? "Meta description present." : "Meta description missing.",
    hasViewport ? "Mobile viewport meta tag is present." : "Mobile viewport meta tag is missing.",
    hasObviousCta ? "There is at least one visible CTA." : "No clear CTA was detected.",
    hasContactSignals
      ? "Contact information appears discoverable."
      : "Contact information may be hard to find.",
  ];

  if (issues.length > 0) {
    summaryParts.push(`Top issues: ${issues.slice(0, 3).join(" ")}`);
  }

  return {
    normalizedUrl,
    homepageTitle: title,
    metaDescription,
    detectedIssues: issues,
    summary: summaryParts.join(" "),
    rawHtmlSnippet: html ? truncate(html.replace(/\s+/g, " "), 2000) : null,
  };
}
