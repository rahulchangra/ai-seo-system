import { describe, it, expect } from "vitest";
import { validateSafeUrl, SSRFError } from "../ssrf";

describe("SSRF Defense Validation", () => {
  it("rejects localhost URLs", async () => {
    await expect(validateSafeUrl("http://localhost/admin")).rejects.toThrow(SSRFError);
    await expect(validateSafeUrl("http://localhost:8080/")).rejects.toThrow(SSRFError);
  });

  it("rejects loopback IPv4 127.0.0.1", async () => {
    await expect(validateSafeUrl("http://127.0.0.1:3000/api")).rejects.toThrow(SSRFError);
  });

  it("rejects link-local and cloud metadata endpoint (169.254.169.254)", async () => {
    await expect(
      validateSafeUrl("http://169.254.169.254/latest/meta-data")
    ).rejects.toThrow(SSRFError);
  });

  it("rejects RFC 1918 private IPv4 subnets (10.x, 192.168.x, 172.16.x)", async () => {
    await expect(validateSafeUrl("http://192.168.1.1/router")).rejects.toThrow(SSRFError);
    await expect(validateSafeUrl("http://10.0.0.5/internal")).rejects.toThrow(SSRFError);
    await expect(validateSafeUrl("http://172.20.0.1/admin")).rejects.toThrow(SSRFError);
  });

  it("rejects dangerous protocol schemes (file:, gopher:, ftp:)", async () => {
    await expect(validateSafeUrl("file:///etc/passwd")).rejects.toThrow(SSRFError);
    await expect(validateSafeUrl("ftp://ftp.example.com")).rejects.toThrow(SSRFError);
  });

  it("permits valid public URLs with standard schemes", async () => {
    const url = await validateSafeUrl("https://example.com");
    expect(url.hostname).toBe("example.com");
    expect(url.protocol).toBe("https:");
  });
});
