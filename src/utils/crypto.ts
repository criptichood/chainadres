import crypto from "crypto";
import { db } from "./wallet.utils"; 
interface Wallet {
  id: string;
  encryptedSeed: number[];
  iv: number[];
  salt: number[];
  // other properties...
}

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

export async function encryptAndSave(walletId: string, seedPhrase: string, derivedKey: CryptoKey, salt: Uint8Array): Promise<void> {
  try {
    const encodedSeed = new TextEncoder().encode(seedPhrase);
    const iv = crypto.randomBytes(16);

    const encryptedSeed = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      derivedKey,
      encodedSeed
    );

  

    // Use a transaction to perform the database operations
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(["wallets"], "readwrite");
      const store = transaction.objectStore("wallets");

      // Find the wallet with the specified ID
      const request = store.get(walletId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const existingWallet = request.result as Wallet;

        // Update the existing wallet or add a new one if it doesn't exist
        const updatedWallet: Wallet = {
          id: walletId,
          encryptedSeed: Array.from(new Uint8Array(encryptedSeed)),
          iv: Array.from(iv),
          salt: Array.from(salt),
        };

        const saveRequest = existingWallet
          ? store.put(updatedWallet)
          : store.add(updatedWallet);

        saveRequest.onerror = () => reject(saveRequest.error);
        saveRequest.onsuccess = () => resolve();
      };
    });

    console.log("Encryption and storage successful!");
  } catch (error) {
    console.error("Encryption and storage failed:", error);
    throw error;
  }
}
