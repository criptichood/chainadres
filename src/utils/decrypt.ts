// utils/decryptLogic.ts

import { decrypt, generateKey } from './crypto';

export async function decryptSeedPhrase(password: string): Promise<string | null> {
  try {
    // Retrieve the encrypted seed phrase from browser storage
    const encryptedSeedPhrase = localStorage.getItem('encryptedSeedPhrase');

    if (!encryptedSeedPhrase) {
      throw new Error('No encrypted seed phrase found.');
    }

    // Generate the key and decrypt the seed phrase
    const derivedKey = await generateKey(password);

    if (!derivedKey) {
      throw new Error('Failed to generate decryption key.');
    }

    const decryptedSeedPhrase = await decrypt(encryptedSeedPhrase, derivedKey);
      
    return decryptedSeedPhrase;
  } catch (error) {
    throw new Error(`Error decrypting seed phrase: ${(error as Error).message}`);
  }
}
