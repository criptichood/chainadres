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
interface Wallet {
  id: string;
  // other properties...
 }
export async function encryptAndSave(walletId: string, seedPhrase: string, derivedKey: CryptoKey, salt: Uint8Array): Promise<void> {
  
  try {
    const encodedSeed = new TextEncoder().encode(seedPhrase);
    const iv = crypto.randomBytes(16);

    const encryptedSeed = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      encodedSeed
    );

    // Get the existing wallets from localStorage
    const existingWallets = JSON.parse(localStorage.getItem('wallets') || '[]');

    // Find the wallet with the specified ID
    const walletIndex = existingWallets.findIndex((wallet: Wallet) => wallet.id === walletId);
    // Update the existing wallet or add a new one if it doesn't exist
    if (walletIndex !== -1) {
      existingWallets[walletIndex].encryptedSeed = Array.from(new Uint8Array(encryptedSeed));
      existingWallets[walletIndex].iv = Array.from(iv);
      existingWallets[walletIndex].salt = Array.from(salt);
    } else {
      existingWallets.push({
        id: walletId,
        encryptedSeed: Array.from(new Uint8Array(encryptedSeed)),
        iv: Array.from(iv),
        salt: Array.from(salt),
      });
    }

    // Update the list of wallets in localStorage
    localStorage.setItem('wallets', JSON.stringify(existingWallets));

    console.log("Encryption successful!");
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}
