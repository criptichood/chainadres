// BalanceService.ts
import { useEffect } from "react";
import { fromNano } from "@ton/ton";
import { Network, getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";

interface BalanceServiceProps {
  network: Network;
  walletAddress: string | null;
  onUpdate: (balance: string | null) => void;
}

const useBalanceService = ({
  network,
  walletAddress,
  onUpdate,
}: BalanceServiceProps) => {
  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;

    const fetchData = async () => {
      try {
        if (!walletAddress) return;
        const address = Address.parse(walletAddress);
        const endpoint = await getHttpEndpoint({ network });
        const client = new TonClient({ endpoint });

        const walletBalance = await client.getBalance(address);
        if (isMounted) {
          onUpdate(fromNano(walletBalance));
        }
        // Reset retry count on successful fetch
        retryCount = 0;
      } catch (error) {
        console.error("Error fetching balance:", (error as Error).message);
        // Increment retry count
        retryCount++;
        // Check if exceeded maximum retries
        if (retryCount >= 10) {
          console.error(
            "Exceeded maximum retry attempts. Stopping further retries."
          );
          clearInterval(intervalId);
        }
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [network, walletAddress, onUpdate]);
};

export default useBalanceService;
