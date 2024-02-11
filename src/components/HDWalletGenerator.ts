// HDWalletGenerator.ts
import { mnemonicToHDSeed, deriveSymmetricPath, keyPairFromSeed, KeyPair } from 'ton-crypto';

export const generateNewHDWallet = async (existingMnemonic: string[], sequentialIndex: number): Promise<{ address: string, privateKey: string }> => {
  try {
    // Generate HD seed from existing mnemonic
    const seed: Buffer = await mnemonicToHDSeed(existingMnemonic);

    // Derive the symmetric key from the seed using a sequential index in the path
    const derivedKey: Buffer = await deriveSymmetricPath(seed, ['my-app', 'wallet', sequentialIndex.toString()]);

    // Create key pair from the derived symmetric key
    const keyPair: KeyPair = keyPairFromSeed(derivedKey);

    // Get the new wallet address and private key
    const address: string = keyPair.publicKey.toString();
    const privateKey: string = keyPair.secretKey.toString('hex');

    return { address, privateKey };
  } catch (error) {
    console.error('Error generating new HD wallet:', (error as Error).message);
    throw error;
  }
};
