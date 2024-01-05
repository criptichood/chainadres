// crypto.ts
import crypto from "crypto";

export async function generateKeyForCreation(
  password: string
): Promise<{ derivedKey: CryptoKey; salt: Uint8Array }> {
  const salt = crypto.randomBytes(16);

  const key = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  const derivedKey = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    key,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  return { derivedKey, salt };
}

export async function encryptAndSave(
  seedPhrase: string,
  derivedKey: CryptoKey,
  salt: Uint8Array
): Promise<void> {
  try {
    const encodedSeed = new TextEncoder().encode(seedPhrase);
    const iv = crypto.randomBytes(16);

    const encryptedSeed = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      encodedSeed
    );

    // Save the encrypted seed, IV, and salt to browser storage
    localStorage.setItem(
      "encryptedSeedPhrase",
      JSON.stringify({
        encryptedSeed: Array.from(new Uint8Array(encryptedSeed)),
        iv: Array.from(iv),
        salt: Array.from(salt),
      })
    );

    console.log("Encryption successful!");
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}
