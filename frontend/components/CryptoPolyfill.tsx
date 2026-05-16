"use client";

import { useEffect } from "react";

export default function CryptoPolyfill() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.crypto && !window.crypto.subtle) {
      console.warn("⚠️ crypto.subtle is undefined (likely insecure context). Polyfilling...");
      
      // @ts-ignore
      window.crypto.subtle = {
        // @ts-ignore
        digest: async (algorithm: string, data: BufferSource) => {
          // A simple deterministic hash fallback for development purposes.
          // This is NOT cryptographically secure, but enough for Sandpack's caching.
          const text = new TextDecoder().decode(data);
          let hash = 0;
          for (let i = 0; i < text.length; i++) {
            hash = (hash << 5) - hash + text.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
          }
          
          // Return a 32-byte buffer (SHA-256 size) filled with the hash and some padding
          const buffer = new ArrayBuffer(32);
          const view = new DataView(buffer);
          view.setInt32(0, hash);
          // Fill the rest with some predictable values based on the hash
          for (let i = 4; i < 32; i++) {
            view.setUint8(i, (hash >> (i % 4)) & 0xff);
          }
          return buffer;
        },
        // Add other stubs if needed by Sandpack
        importKey: async () => ({}),
        sign: async () => new ArrayBuffer(0),
        verify: async () => true,
      };
    }
  }, []);

  return null;
}
