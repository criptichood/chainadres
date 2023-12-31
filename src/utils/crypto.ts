import crypto from 'crypto';

export async function generateKey(password: string): Promise<CryptoKey> {
  const salt = crypto.randomBytes(16);
  const key = await window.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await window.crypto.subtle.deriveKey(
    
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,  // Make sure this matches the value used during decryption
      hash: 'SHA-256',
    },
    key,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return derivedKey;
}

export async function encrypt(seedPhrase: string, derivedKey: CryptoKey): Promise<void> {
  try {
    const encodedSeed = new TextEncoder().encode(seedPhrase);
    const iv = crypto.randomBytes(12);

    const encryptedSeed = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      derivedKey,
      encodedSeed
    );

    // Save the encrypted seed and IV to browser storage
    localStorage.setItem('encryptedSeedPhrase', JSON.stringify({
      encryptedSeed: Array.from(new Uint8Array(encryptedSeed)),
      iv: Array.from(iv)
    }));

    console.log('Encryption successful!');
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
}

// crypto.ts

export async function decrypt(encryptedSeedPhrase: string, derivedKey: CryptoKey): Promise<string | null> {
  try {
    console.log('Starting decryption...');
    
    // Parse the JSON and retrieve the IV and encrypted seed
    const storedData = JSON.parse(encryptedSeedPhrase);
    console.log('Parsed JSON:', storedData);

    const { encryptedSeed, iv } = storedData;
    console.log('IV:', iv);
    console.log('Encrypted Seed:', encryptedSeed);

    // Decrypt the seed phrase
    const decryptedSeed = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      derivedKey,
      new Uint8Array(encryptedSeed)
    );

    const decryptedSeedPhrase = new TextDecoder().decode(decryptedSeed);
    console.log('Decrypted Seed Phrase:', decryptedSeedPhrase);

    return decryptedSeedPhrase;
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Decryption failed. Please check your password and try again.'); // Provide a more user-friendly error message
  }
}
