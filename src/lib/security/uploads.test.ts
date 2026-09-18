import { describe, expect, it } from "vitest";

import { isAllowedReceipt, isAllowedResume } from "./uploads";

describe("upload signatures", () => {
  it("accepts matching file signatures", () => {
    expect(
      isAllowedResume(
        new Uint8Array([0x25, 0x50, 0x44, 0x46]),
        "application/pdf",
      ),
    ).toBe(true);
    expect(
      isAllowedReceipt(new Uint8Array([0xff, 0xd8, 0xff, 0x00]), "image/jpeg"),
    ).toBe(true);
  });

  it("rejects extension or MIME spoofing", () => {
    expect(
      isAllowedResume(
        new Uint8Array([0x4d, 0x5a, 0x90, 0x00]),
        "application/pdf",
      ),
    ).toBe(false);
    expect(
      isAllowedReceipt(new Uint8Array([0x3c, 0x73, 0x76, 0x67]), "image/png"),
    ).toBe(false);
  });
});
