import * as cheerio from "cheerio";
import crypto from "crypto";
import { validateSafeUrl } from "./ssrf";
import { CrawledPageData, CrawlOptions, CrawlResult } from "./types";

export class ProductionCrawler {
  private defaultUserAgent = "AI-SEO-Auditor/1.0 (+https://ai-seo-system.local/bot)";

  /**
   * Normalizes a URL: enforces http/https, lowercases domain, strips hashes, normalizes slashes.
   */
  public normalizeUrl(rawUrl: string, baseUrl?: string): string | null {
    try {
      const parsed = baseUrl ? new URL(rawUrl, baseUrl) : new URL(rawUrl);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null;
      }
      parsed.hash = ""; // drop fragment
      // remove common tracking query params
      const trackingParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"];
      trackingParams.forEach((p) => parsed.searchParams.delete(p));

      // Normalise trailing slash on root
      if (parsed.pathname === "") {
        parsed.pathname = "/";
      }

      return parsed.toString();
    } catch {
      return null;
    }
  }

  /**
   * Fetches and parses robots.txt for disallow rules and sitemap directives.
   */
  public async fetchRobotsTxt(
    origin: string
  ): Promise<{ rules: string[]; sitemaps: string[] }> {
    const sitemaps: string[] = [];
    const rules: string[] = [];
    try {
      const robotsUrl = new URL("/robots.txt", origin).toString();
      await validateSafeUrl(robotsUrl);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(robotsUrl, {
        headers: { "User-Agent": this.defaultUserAgent },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const text = await res.text();
        const lines = text.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.toLowerCase().startsWith("sitemap:")) {
            const smUrl = trimmed.slice(8).trim();
            if (smUrl) sitemaps.push(smUrl);
          } else if (trimmed.toLowerCase().startsWith("disallow:")) {
            const rule = trimmed.slice(9).trim();
            if (rule) rules.push(rule);
          }
        }
      }
    } catch {
      // Graceful fallback if robots.txt is unavailable or timeout
    }
    return { rules, sitemaps };
  }

  /**
   * Attempts to discover sitemap URLs from /sitemap.xml if none found in robots.txt.
   */
  public async discoverSitemaps(origin: string): Promise<string[]> {
    const found: string[] = [];
    const candidates = ["/sitemap.xml", "/sitemap_index.xml"];

    for (const path of candidates) {
      try {
        const smUrl = new URL(path, origin).toString();
        await validateSafeUrl(smUrl);

        const res = await fetch(smUrl, {
          method: "HEAD",
          headers: { "User-Agent": this.defaultUserAgent },
        });

        if (res.ok) {
          found.push(smUrl);
        }
      } catch {
        // continue
      }
    }

    return found;
  }

  /**
   * Fetches and extracts full SEO diagnostics for a single page.
   */
  public async fetchAndAuditPage(
    targetUrl: string,
    timeoutMs = 10000
  ): Promise<CrawledPageData> {
    // 1. Strict SSRF Defense Check
    await validateSafeUrl(targetUrl);

    const startTime = Date.now();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let res: Response;
    try {
      res = await fetch(targetUrl, {
        headers: {
          "User-Agent": this.defaultUserAgent,
          Accept: "text/html,application/xhtml+xml",
        },
        signal: controller.signal,
        redirect: "follow",
      });
    } finally {
      clearTimeout(timer);
    }

    const loadTimeMs = Date.now() - startTime;
    const finalUrl = res.url || targetUrl;
    const statusCode = res.status;
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => {
      headers[k.toLowerCase()] = v;
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    // Title
    const title = $("title").first().text().trim() || null;

    // Meta Description
    const metaDescription =
      $('meta[name="description" i]').attr("content")?.trim() ||
      $('meta[property="og:description" i]').attr("content")?.trim() ||
      null;

    // Canonical Tag
    const canonicalUrl = $('link[rel="canonical" i]').attr("href")?.trim() || null;

    // Robots meta directive
    const robotsMeta = $('meta[name="robots" i]').attr("content")?.trim() || null;

    // Headings (H1 & H2)
    const h1Tags: string[] = [];
    $("h1").each((_, el) => {
      const text = $(el).text().trim();
      if (text) h1Tags.push(text);
    });

    const h2Tags: string[] = [];
    $("h2").each((_, el) => {
      const text = $(el).text().trim();
      if (text) h2Tags.push(text);
    });

    // Links (internal vs external)
    const currentOrigin = new URL(finalUrl).origin;
    const internalLinksSet = new Set<string>();
    const externalLinksSet = new Set<string>();

    $("a[href]").each((_, el) => {
      const href = $(el).attr("href");
      if (!href) return;

      const normalized = this.normalizeUrl(href, finalUrl);
      if (!normalized) return;

      try {
        const linkOrigin = new URL(normalized).origin;
        if (linkOrigin === currentOrigin) {
          internalLinksSet.add(normalized);
        } else {
          externalLinksSet.add(normalized);
        }
      } catch {
        // ignore
      }
    });

    // Images & Missing Alt Attributes
    let imageCount = 0;
    let missingAltCount = 0;
    $("img").each((_, el) => {
      imageCount++;
      const alt = $(el).attr("alt");
      if (alt === undefined || alt === null || alt.trim() === "") {
        missingAltCount++;
      }
    });

    // Structured Data (JSON-LD)
    const schemaTypesSet = new Set<string>();
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const rawJson = $(el).html();
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          const extractType = (obj: Record<string, unknown>) => {
            if (!obj) return;
            if (typeof obj["@type"] === "string") {
              schemaTypesSet.add(obj["@type"]);
            } else if (Array.isArray(obj["@type"])) {
              obj["@type"].forEach((t) => typeof t === "string" && schemaTypesSet.add(t));
            }
            if (Array.isArray(obj["@graph"])) {
              obj["@graph"].forEach((item: unknown) => {
                if (typeof item === "object" && item !== null) {
                  extractType(item as Record<string, unknown>);
                }
              });
            }
          };
          if (Array.isArray(parsed)) {
            parsed.forEach((item) => extractType(item));
          } else if (typeof parsed === "object") {
            extractType(parsed);
          }
        }
      } catch {
        // invalid JSON in script tag
      }
    });

    // OpenGraph
    const openGraph = {
      title: $('meta[property="og:title" i]').attr("content")?.trim(),
      description: $('meta[property="og:description" i]').attr("content")?.trim(),
      image: $('meta[property="og:image" i]').attr("content")?.trim(),
      type: $('meta[property="og:type" i]').attr("content")?.trim(),
    };

    // Body Visible Word Count
    // Remove scripts, styles, noscript
    $("script, style, noscript, svg").remove();
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    const wordCount = bodyText ? bodyText.split(/\s+/).length : 0;

    // Content Hash
    const contentHash = crypto
      .createHash("sha256")
      .update(bodyText)
      .digest("hex");

    return {
      url: finalUrl,
      statusCode,
      loadTimeMs,
      title,
      metaDescription,
      canonicalUrl,
      robotsMeta,
      h1Tags,
      h2Tags,
      internalLinks: Array.from(internalLinksSet),
      externalLinks: Array.from(externalLinksSet),
      imageCount,
      missingAltCount,
      schemaTypes: Array.from(schemaTypesSet),
      wordCount,
      contentHash,
      openGraph,
      headers,
    };
  }

  /**
   * Crawls a website starting from baseUrl up to maxPages.
   */
  public async crawlSite(
    baseUrl: string,
    options: CrawlOptions = {}
  ): Promise<CrawlResult> {
    const startTime = Date.now();
    const maxPages = options.maxPages || 10;
    const rateLimitMs = options.rateLimitMs || 300;

    const normalizedRoot = this.normalizeUrl(baseUrl);
    if (!normalizedRoot) {
      throw new Error(`Invalid root URL: ${baseUrl}`);
    }

    const origin = new URL(normalizedRoot).origin;

    // 1. Robots.txt and Sitemap Check
    const robots = await this.fetchRobotsTxt(origin);
    let sitemaps = robots.sitemaps;
    if (sitemaps.length === 0) {
      sitemaps = await this.discoverSitemaps(origin);
    }

    const pages: CrawledPageData[] = [];
    const errors: Array<{ url: string; error: string }> = [];
    const visited = new Set<string>();
    const queue: string[] = [normalizedRoot];

    while (queue.length > 0 && pages.length < maxPages) {
      const currentUrl = queue.shift()!;
      if (visited.has(currentUrl)) continue;
      visited.add(currentUrl);

      try {
        const pageData = await this.fetchAndAuditPage(
          currentUrl,
          options.timeoutMs || 10000
        );
        pages.push(pageData);

        // Enqueue internal links within same origin
        for (const link of pageData.internalLinks) {
          if (!visited.has(link) && queue.length + pages.length < maxPages * 2) {
            queue.push(link);
          }
        }
      } catch (err: unknown) {
        errors.push({
          url: currentUrl,
          error: (err as Error).message || "Unknown error",
        });
      }

      // Polite crawling rate-limit delay
      if (rateLimitMs > 0 && queue.length > 0 && pages.length < maxPages) {
        await new Promise((r) => setTimeout(r, rateLimitMs));
      }
    }

    return {
      baseUrl: normalizedRoot,
      totalPages: pages.length,
      durationMs: Date.now() - startTime,
      pages,
      sitemapUrlsFound: sitemaps,
      robotsTxtPresent: robots.rules.length > 0 || robots.sitemaps.length > 0,
      errors,
    };
  }
}
