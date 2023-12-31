// components/ViewPhrase.tsx

import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { decryptSeedPhrase } from '../utils/decrypt';

interface ViewPhraseProps {
  show: boolean;
  onClose: () => void;
}

const ViewPhrase: React.FC<ViewPhraseProps> = ({ show, onClose }) => {
  const [decryptedPhrase, setDecryptedPhrase] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleDecrypt = async () => {
    try {
      // Decrypt the seed phrase using the logic function
      const decryptedSeedPhrase = await decryptSeedPhrase(password);
    
      // Set the decrypted phrase to the state
      setDecryptedPhrase(decryptedSeedPhrase);
      
      // Clear sensitive data from memory
      setPassword('');
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>View Seed Phrase</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {decryptedPhrase ? (
          <p>{decryptedPhrase}</p>
        ) : (
          <>
            <p>Enter your password to view the seed phrase:</p>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {!decryptedPhrase && (
          <Button variant="primary" onClick={handleDecrypt}>
            Decrypt and View
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ViewPhrase;
