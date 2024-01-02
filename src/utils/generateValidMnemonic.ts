import {
    mnemonicNew,
    mnemonicValidate,
  } from "../ton-crypto/src/mnemonic/mnemonic";
  export async function generateValidMnemonic():Promise <string>{
    
   try {
      let isValidMnemonic = false;
      let attemptCount = 0;
      const maxAttempts = 5;
  
      while (!isValidMnemonic && attemptCount < maxAttempts) {
        const numberOfWords = 24;
        const newMnemonic: string[] = await mnemonicNew(numberOfWords);
        isValidMnemonic = await mnemonicValidate(newMnemonic);
  
        if (!isValidMnemonic) {
          attemptCount += 1;
        } else {
          const outputPhrase: string = newMnemonic.join(" ");
          
          
          return outputPhrase;
        }
      }
  
      throw new Error("Failed to generate a valid mnemonic after multiple attempts.");
    } catch (error) {
      console.error("Error generating mnemonic:", error);
      setError("Failed to generate a valid mnemonic. Please try again.");
    }
  };
export default generateValidMnemonic();