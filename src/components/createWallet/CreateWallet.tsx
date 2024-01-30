import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert, Card, CardBody, ListGroup } from 'react-bootstrap';
import { encryptAndSave, generateKeyForCreation } from '../../utils/crypto';
import { generateValidMnemonic } from '../../utils/mnemonicUtils';
import { verifyPasswordStrength } from '../../utils/passwordUtils';


const CreateWallet: React.FC = () => {
  const [showModal, setShowModal] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [seedPhrase, setSeedPhrase] = useState<string | null>("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  


  const handleShowModal = () => setShowModal(true);

  useEffect(() => {
    async function generateValidMnemonicAndSetSeedPhrase() {
      try {
        const numberOfWords = 24;
        const maxAttempts = 5;
        const newMnemonic = await generateValidMnemonic(numberOfWords, maxAttempts);
        setSeedPhrase(newMnemonic);
      } catch (error) {
        console.error('Error generating mnemonic:', error);
        setError('Failed to generate a valid mnemonic. Please try again.');
      }
    }

    generateValidMnemonicAndSetSeedPhrase();
  }, []);


  interface Wallet {
    id: string;
    // other properties...
   }
  const handleCreateWallet = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }
  
      if (!verifyPasswordStrength(password)) {
        throw new Error('Password does not meet the required strength criteria.');
      }
  
      const { derivedKey, salt } = await generateKeyForCreation(password);
  
      // Open or create the IndexedDB database
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open('walletsDB', 1);
  
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
  
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
          const db = (event.target as IDBOpenDBRequest).result;
          db.createObjectStore('wallets', { keyPath: 'id' });
        };
      });
  
      // Use a transaction to perform the database operations
      await new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(['wallets'], 'readwrite');
        const store = transaction.objectStore('wallets');
  
        // Check for existing wallets
        const getAllWalletsRequest = store.getAll();
        getAllWalletsRequest.onsuccess = (event) => {
          if (event.target) {
            const existingWallets = (event.target as IDBRequest).result as Wallet[];
        
            // Find a unique ID for the new wallet
            let walletId = `Wallet0`;
            let counter = 1;
            while (existingWallets.some((wallet) => wallet.id === walletId)) {
              walletId = `Wallet${counter}`;
              counter++;
            }
        
            // Encrypt and save seed phrase
            encryptAndSave(walletId, seedPhrase!, derivedKey, salt)
              .then(() => {
                // Clear sensitive data from memory
                setPassword('');
                setConfirmPassword('');
                setSeedPhrase(null);
                setError(null);
                setShowModal(false);
                resolve();
              })
              .catch((error) => {
                console.error('Encryption and storage failed:', error);
                reject(error);
              });
          }
        };
  
        getAllWalletsRequest.onerror = () => {
          console.error('Error fetching existing wallets:', getAllWalletsRequest.error);
          reject(getAllWalletsRequest.error);
        };
      });
    } catch (error) {
      let errorMessage = '';
      switch ((error as Error).message) {
        case 'Passwords do not match.':
          errorMessage = 'Your passwords do not match. Please ensure they are identical.';
          break;
        case 'Password does not meet the required strength criteria.':
          errorMessage = 'Your password is not strong enough. Please choose a stronger password.';
          break;
        default:
          errorMessage = `An unexpected error occurred: ${(error as Error).message}`;
      }
      setError(errorMessage);
    }
  };
  
  return (
    <>
      <Button onClick={handleShowModal}>Create Wallet</Button>
    
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Alert variant="danger">
            <p style={{ color: "black" }}>
              Do not lose your seed phrase. Anyone who has your seed phrase can
              access your wallet.
            </p>
          </Alert>
          {/* Display Phrase */}
          <Card>
            <CardBody>
              <ListGroup as="ol" horizontal numbered className="flex-wrap ">
                {seedPhrase &&
                  seedPhrase.split(' ').map((word, index) => (
                    <ListGroup.Item
                      key={index}
                      variant="primary"
                      as="li"
                      className="d-flex justify-content-between col-md-6 col-lg-4 mb-3"
                    >
                      <div className="ms-2 me-auto">{word}</div>
                    </ListGroup.Item>
                  ))}
              </ListGroup>

              <p style={{ color: "" }}>{seedPhrase}</p>
            </CardBody>
          </Card>
          <Form.Check
            type="checkbox"
            label="I accept the terms of service"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
          />
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateWallet}>
            Create Wallet
          </Button>
        </Modal.Footer>
      </Modal>
      {/* View Phrase Modal */}
    
    </>
  );
};

export default CreateWallet;
