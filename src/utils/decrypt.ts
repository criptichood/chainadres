// decrypt.ts
import { db } from "./wallet.utils";
// Function for generating a key during decryption
export async function generateKeyForDecryption(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  try {
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

    return derivedKey;
  } catch (error) {
    console.error("Key generation failed:", error);
    throw new Error("Key generation failed. Please try again.");
  }
}

// Function for decrypting the seed phrase
export async function decryptPhrase(
  selectedWallet: string | null,
  password: string
): Promise<string | null> {
  try {
  
    // Use a transaction to perform the database operations
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const foundWallet = await new Promise<any>((resolve, reject) => {
      const transaction = db.transaction(['wallets'], 'readonly');
      const store = transaction.objectStore('wallets');

      if (selectedWallet) {
       // Find the wallet with the specified ID
       const request = store.get(selectedWallet);

       request.onerror = () => reject(request.error);
       request.onsuccess = () => resolve(request.result);
      } else {
       reject(new Error('No wallets found or selectedWallet is null'));
      }
    });

    if (foundWallet) {
      // Retrieve the IV, encrypted seed, and salt directly from the found wallet
      const { encryptedSeed, iv, salt } = foundWallet;

      // Use the stored salt to derive the key
      const derivedKey = await generateKeyForDecryption(
        password,
        new Uint8Array(salt)
      );

      // Decrypt the seed phrase using the derived key
      const decryptedSeed = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(iv) },
        derivedKey,
        new Uint8Array(encryptedSeed)
      );

      const decryptedSeedPhrase = new TextDecoder().decode(decryptedSeed);

      return decryptedSeedPhrase;
    } else {
      console.error("Wallet not found");
      return null;
    }
  } catch (error) {
   
    throw new Error(
      `Decryption failed. Please check your password and try again. ${
        (error as Error).message
      }`
    );
  }
}
