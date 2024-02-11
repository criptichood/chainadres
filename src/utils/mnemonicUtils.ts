// mnemonicUtils.ts

import {
  mnemonicNew,
  mnemonicValidate,
  
} from "../ton-crypto/src/mnemonic/mnemonic";

export async function generateValidMnemonic(
  numberOfWords: number,
  maxAttempts: number
): Promise<string> {
  let isValidMnemonic = false;
  let newMnemonic: string[] = [];
  let attemptCount = 0;

  while (!isValidMnemonic && attemptCount < maxAttempts) {
    newMnemonic = await mnemonicNew(numberOfWords);
    isValidMnemonic = await mnemonicValidate(newMnemonic);
    attemptCount += 1;
  }

  if (!isValidMnemonic) {
    throw new Error(
      "Failed to generate a valid mnemonic after multiple attempts."
    );
  }
  console.log("Generated keys: ", newMnemonic);

  const outputPhrase: string = newMnemonic.join(" ");

  return outputPhrase;
}
