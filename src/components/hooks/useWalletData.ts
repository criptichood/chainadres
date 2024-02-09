// useWalletData.ts
import { useState, useEffect, useCallback } from "react";
import { loadConfig, loadNetwork, saveConfig } from "../../config/config";
import { db } from "../../utils/wallet.utils";
import { z } from "zod";

interface Wallet {
  id: string;
  // Add other properties as needed
}

export enum Network {
  Mainnet = "mainnet",
  Testnet = "testnet",
  // ... other network options
}

// Define Zod schema for the hook's state
const WalletDataSchema = z.object({
  wallets: z.array(z.object({ id: z.string() })),
  selectedWallet: z.string().nullable(),
  network: z.nativeEnum(Network),
  // Use z.enum for enum types
});

type WalletData = z.infer<typeof WalletDataSchema>;


const useWalletData = () => {
  const [walletData, setWalletData] = useState<WalletData>({
    wallets: [],
    selectedWallet: null,
    network: Network.Mainnet, // Set the default value
  });



  const fetchExistingWallets = useCallback(async (): Promise<Wallet[]> => {
    try {
      const transaction = db.transaction(["wallets"], "readonly");
      const store = transaction.objectStore("wallets");

      const wallets = await new Promise<Wallet[]>((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      });

      return wallets;
    } catch (error) {
      console.error("Error fetching wallets from IndexedDB:", error);
      throw new Error("Failed to fetch wallets. Please try again.");
    }
  }, []);

  useEffect(() => {
    const fetchDataOnMount = async () => {
      try {
        const existingWallets = await fetchExistingWallets();
        const savedWallet = await loadConfig("selectedWallet");

        const loadedNetwork = await loadNetwork();
        let selectedWalletId: string | null = null;

        if (!savedWallet && existingWallets.length > 0) {
          selectedWalletId = existingWallets[0].id;
          //Load network config
          if (!loadedNetwork) {
            const defaultNetwork: Network = Network.Mainnet;
            console.log("Setting default network:", defaultNetwork);
            saveConfig("selectedNetwork", defaultNetwork);
          }

          saveConfig("selectedWallet", selectedWalletId);

        } else if (savedWallet) {
          selectedWalletId = savedWallet;
         
          setWalletData((prev) => ({
            ...prev,
            wallets: existingWallets,
           selectedWallet: selectedWalletId,
            network: loadedNetwork || Network.Mainnet,
          }));
        }

        // Now, call fetchData with the retrieved values
      } catch (error) {
        console.error("Error during initial data fetch:", error);
        // Handle error during initial data fetch
      }
    };

    fetchDataOnMount();
  }, [fetchExistingWallets]);


  
  return {
    ...walletData,
    setWallets: (wallets: Wallet[]) =>
      setWalletData((prev) => ({ ...prev, wallets })),
    setSelectedWallet: (selectedWallet: string | null) =>
      setWalletData((prev) => ({ ...prev, selectedWallet })),
    setNetwork: (network: Network) =>
      setWalletData((prev) => ({ ...prev, network })),
  };
};

export default useWalletData;
