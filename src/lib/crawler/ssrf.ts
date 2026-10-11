import dns from "dns/promises";
import net from "net";

export class SSRFError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SSRFError";
  }
}

/**
 * Checks whether an IPv4 address is in a reserved/private range.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return true;

  // 0.0.0.0/8 (Broadcast/Current network)
  if (parts[0] === 0) return true;

  // 10.0.0.0/8 (Private network)
  if (parts[0] === 10) return true;

  // 127.0.0.0/8 (Loopback)
  if (parts[0] === 127) return true;

  // 169.254.0.0/16 (Link-Local, AWS/GCP/Azure Metadata 169.254.169.254)
  if (parts[0] === 169 && parts[1] === 254) return true;

  // 172.16.0.0/12 (Private network: 172.16.0.0 - 172.31.255.255)
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

  // 192.168.0.0/16 (Private network)
  if (parts[0] === 192 && parts[1] === 168) return true;

  // 100.64.0.0/10 (Carrier-grade NAT)
  if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;

  // 224.0.0.0/4 (Multicast)
  if (parts[0] >= 224) return true;

  return false;
}

/**
 * Checks whether an IPv6 address is reserved/private.
 */
function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return true;
  // Link local (fe80::)
  if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true;
  // Unique local (fc00::, fd00::)
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
  return false;
}

/**
 * Strictly validates that a target URL is safe to fetch and not pointing to
 * private infrastructure, localhost, link-local, or cloud metadata services.
 */
export async function validateSafeUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new SSRFError(`Invalid URL string: ${rawUrl}`);
  }

  // Scheme restriction: only HTTP/HTTPS
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new SSRFError(`Prohibited URL protocol: ${parsed.protocol}. Only http: and https: are allowed.`);
  }

  const hostname = parsed.hostname.toLowerCase();

  // Explicit string blocks for dangerous domains/hosts
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal") ||
    hostname === "metadata.google.internal" ||
    hostname === "instance-data"
  ) {
    throw new SSRFError(`Blocked prohibited hostname: ${hostname}`);
  }

  // If hostname is directly an IP address
  if (net.isIP(hostname)) {
    if (net.isIPv4(hostname) && isPrivateIPv4(hostname)) {
      throw new SSRFError(`Prohibited private IPv4 address: ${hostname}`);
    }
    if (net.isIPv6(hostname) && isPrivateIPv6(hostname)) {
      throw new SSRFError(`Prohibited private IPv6 address: ${hostname}`);
    }
    return parsed;
  }

  // Resolve hostname via DNS to prevent DNS rebinding to internal networks
  try {
    const addresses = await dns.lookup(hostname, { all: true });
    for (const record of addresses) {
      if (record.family === 4 && isPrivateIPv4(record.address)) {
        throw new SSRFError(
          `DNS resolved hostname '${hostname}' to prohibited private IP: ${record.address}`
        );
      }
      if (record.family === 6 && isPrivateIPv6(record.address)) {
        throw new SSRFError(
          `DNS resolved hostname '${hostname}' to prohibited private IPv6: ${record.address}`
        );
      }
    }
  } catch (err: unknown) {
    if (err instanceof SSRFError) throw err;
    throw new SSRFError(`Could not resolve hostname '${hostname}': ${(err as Error).message}`);
  }

  return parsed;
}
