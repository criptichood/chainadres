// config.ts
import { z } from 'zod';

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
  // ... other network options
}

// Define Zod schema for configuration data
const ConfigSchema = z.object({
  key: z.string(),
  value: z.string(),
});

// Define Zod schema for the network configuration
const NetworkConfigSchema = z.object({
  selectedNetwork: z.enum([Network.Mainnet, Network.Testnet]),
});

// Open or create the IndexedDB database
const openDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('configDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('config', { keyPath: 'key' });
    };
  });
};

// Function to save configuration to IndexedDB
export const saveConfig = async (key: string, value: string): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(['config'], 'readwrite');
    const store = transaction.objectStore('config');

    // Validate the input against the schema
    ConfigSchema.parse({ key, value });

    store.put({ key, value });
    // console.log(`Configuration saved: ${key}`);
  } catch (error) {
    console.error(`Error saving configuration: ${key}`, error);
    throw error;
  }
};

// Function to load configuration from IndexedDB
export const loadConfig = async (key: string): Promise<string | null> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(['config'], 'readonly');
    const store = transaction.objectStore('config');
    const request = store.get(key);

    return new Promise((resolve) => {
      request.onerror = () => resolve(null);
      request.onsuccess = () => {
        const storedValue = request.result;
        if (storedValue) {
          // Validate the retrieved value against the schema
          ConfigSchema.parse(storedValue);
          // console.log(`Configuration loaded: ${key}`);
          resolve(storedValue.value);
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.error(`Error loading configuration: ${key}`, error);
    throw error;
  }
};

// Function to load network from IndexedDB
export const loadNetwork = async (): Promise<Network | null> => {
  try {
    const networkConfig = await loadConfig('selectedNetwork');

    if (networkConfig !== null) {
      // Validate the retrieved network configuration against the schema
      NetworkConfigSchema.parse({ selectedNetwork: networkConfig });
      return networkConfig as Network;
    }

    return null;
  } catch (error) {
    console.error('Error loading network configuration', error);
    throw error;
  }
};
