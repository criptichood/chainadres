/* eslint-disable @typescript-eslint/no-explicit-any */
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal } from "@ton/ton";

export interface Recipient {
  to: string;
}

export interface TransactionResult {
  success: boolean;
  successCount?: number;
  errorMessage?: string;
}

export async function sendTransaction(
  recipients: Recipient[]
): Promise<TransactionResult> {
  const mnemonic =
    "raccoon mechanic glare stamp avoid car clip leg predict start upon action involve before fiscal cluster aisle argue puzzle twin usual scatter merge brief";
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  if (!await client.isContractDeployed(wallet.address)) {
    return { success: false, errorMessage: "Wallet is not deployed" };
  }

  const chunkSize = 4;
  let successCount = 0;

  for (let i = 0; i < recipients.length; i += chunkSize) {
    const currentRecipients = recipients.slice(i, i + chunkSize);

    const messages = currentRecipients.map(recipient => {
      return internal({
        to: recipient.to,
        value: '0.001',
        body: 'Using the interface ' || "",
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
      console.log(`Transaction for recipients ${i + 1} to ${i + currentRecipients.length} confirmed!`);
    } catch (error: any) {
      console.error(`Error sending transaction for recipients ${i + 1} to ${i + currentRecipients.length}: ${error.message}`);
      console.log('Failed Addresses:', currentRecipients.map(recipient => recipient.to));
      return { success: false, errorMessage: error.message };
    }
  }

  return { success: true, successCount };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
