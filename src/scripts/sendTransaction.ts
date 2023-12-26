/* eslint-disable @typescript-eslint/no-explicit-any */
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";
import * as dotenv from 'dotenv';
dotenv.config();
export interface Recipient {
  to: string;      // 'address' property 
  value?: string; // 'value' property
  body?: string;  // 'body' property
}

export interface TransactionResult {
  success: boolean;
  successCount?: number;
  errorMessage?: string;
  failedAddresses?: string[];
}

export interface ProgressCallback {
  (
    current: number,
    total: number,
    confirmationMessage: string,
    failedAddresses: string[]
  ): void;
}

export async function sendTransaction(
  recipients: Recipient[],
  onProgress: ProgressCallback
): Promise<TransactionResult> {
  const mnemonic = import.meta.env.VITE_MNEMONIC_PHRASE || '';
  if (!mnemonic.trim()) {
    return { success: false, errorMessage: 'Mnemonic phrase not provided in the environment variables' };
  }
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({
    publicKey: key.publicKey,
    workchain: 0,
  });

  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  if (!(await client.isContractDeployed(wallet.address))) {
    return { success: false, errorMessage: "Wallet is not deployed" };
  }

  const chunkSize = 4;
  let successCount = 0;
  const failedAddresses: string[] = [];

  for (let i = 0; i < recipients.length; i += chunkSize) {
    const currentRecipients = recipients.slice(i, i + chunkSize);

    const messages = currentRecipients.map((recipient) => {
      return internal({
        to: recipient.to,
        value: recipient.value || '0.001',  // Use the provided value or default to '0.001'
        body: recipient.body || " ",  // Use the provided body or default to 'Input it'
        bounce: false,
      });
    });

    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    try {
      await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        messages: messages,
      });

      let currentSeqno = seqno;
      while (currentSeqno === seqno) {
        console.log("Waiting for the transaction to confirm...");
        await sleep(5500);
        currentSeqno = await walletContract.getSeqno();
      }

      successCount += currentRecipients.length;

      // Display only the first 10 characters of the first address and the last 5 characters of the last address
      const displayStart = currentRecipients[0].to.slice(0, 10);
      const displayEnd = currentRecipients[currentRecipients.length - 1].to.slice(-5);
      const confirmationMessage = `Transaction for recipients ${i + 1} to ${
        i + currentRecipients.length
      } confirmed! Displaying addresses: ${displayStart}...${displayEnd}`;
      onProgress(i + currentRecipients.length, recipients.length, confirmationMessage, failedAddresses);
    } catch (error: any) {
      console.error(
        `Error sending transaction for recipients ${i + 1} to ${
          i + currentRecipients.length
        }: ${error.message}`
      );
      console.log('Failed Addresses:', currentRecipients.map(recipient => recipient.to));
      failedAddresses.push(...currentRecipients.map(recipient => recipient.to));
    }
  }

  return { success: true, successCount, failedAddresses };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
