export interface CrawledPageData {
  url: string;
  statusCode: number;
  loadTimeMs: number;
  title: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  robotsMeta: string | null;
  h1Tags: string[];
  h2Tags: string[];
  internalLinks: string[];
  externalLinks: string[];
  imageCount: number;
  missingAltCount: number;
  schemaTypes: string[];
  wordCount: number;
  contentHash: string;
  openGraph: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  headers: Record<string, string>;
}

export interface CrawlOptions {
  maxPages?: number;
  maxDepth?: number;
  rateLimitMs?: number;
  timeoutMs?: number;
  userAgent?: string;
  honorRobotsTxt?: boolean;
}

export interface CrawlResult {
  baseUrl: string;
  totalPages: number;
  durationMs: number;
  pages: CrawledPageData[];
  sitemapUrlsFound: string[];
  robotsTxtPresent: boolean;
  errors: Array<{ url: string; error: string }>;
}
