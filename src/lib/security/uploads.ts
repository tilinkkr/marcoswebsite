const signatures = {
  pdf: [0x25, 0x50, 0x44, 0x46],
  zip: [0x50, 0x4b, 0x03, 0x04],
  doc: [0xd0, 0xcf, 0x11, 0xe0],
  png: [0x89, 0x50, 0x4e, 0x47],
  jpeg: [0xff, 0xd8, 0xff],
  webp: [0x52, 0x49, 0x46, 0x46],
} as const;

function startsWith(bytes: Uint8Array, signature: readonly number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

export function isAllowedResume(bytes: Uint8Array, mime: string) {
  if (mime === "application/pdf") return startsWith(bytes, signatures.pdf);
  if (mime === "application/msword") return startsWith(bytes, signatures.doc);
  if (
    mime ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return startsWith(bytes, signatures.zip);
  }
  return false;
}

export function isAllowedReceipt(bytes: Uint8Array, mime: string) {
  if (mime === "image/png") return startsWith(bytes, signatures.png);
  if (mime === "image/jpeg") return startsWith(bytes, signatures.jpeg);
  if (mime === "image/webp") {
    return (
      startsWith(bytes, signatures.webp) &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }
  return false;
}
