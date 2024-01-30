// useWalletData.ts
import { useState, useEffect, useCallback } from 'react';
import { loadConfig, loadNetwork, saveConfig } from '../../config/config';
import { db } from '../../utils/wallet.utils';
import { Network } from '@orbs-network/ton-access';

interface Wallet {
  id: string;
  // Add other properties as needed
}

const useWalletData = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network>('mainnet');

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
    const fetchData = async () => {
      try {
        const existingWallets = await fetchExistingWallets();
        setWallets(existingWallets);

        const savedWallet = await loadConfig('selectedWallet');
        let selectedWalletId;

        if (!savedWallet && existingWallets.length > 0) {
            selectedWalletId = existingWallets[0].id;
           
            setSelectedWallet(selectedWalletId);
            saveConfig("selectedWallet", selectedWalletId);
          } else if (savedWallet) {
            selectedWalletId = savedWallet;
            setSelectedWallet(selectedWalletId);
          }
    

        // Fetch data based on the selected wallet
      } catch (error) {
        console.error('Error fetching wallets:', error);
        // Handle error
      }

      try {
        const loadedNetwork = await loadNetwork();
        if (loadedNetwork) {
            setNetwork(loadedNetwork);
          } else {
            // If no network is found, set it to 'mainnet' by default and save it to config
            const defaultNetwork: Network = "mainnet";
            setNetwork(defaultNetwork);
    
            saveConfig("selectedNetwork", defaultNetwork);
          }
      } catch (error) {
        console.error('Error loading selected network:', error);
        // Handle error loading network
      }
    };

    fetchData();
  }, [fetchExistingWallets]);

  return { wallets, selectedWallet, network, setWallets, setSelectedWallet, setNetwork };
};

export default useWalletData;
