// ViewPhrase.tsx
import React, { useState } from "react";
import { Modal, Button, Alert } from "react-bootstrap";
import { decryptPhrase } from "../../utils/decrypt"; 

interface ViewPhraseProps {
  show: boolean;
  onClose: () => void;
}

const ViewPhrase: React.FC<ViewPhraseProps> = ({ show, onClose }) => {
  const [decryptedPhrase, setDecryptedPhrase] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDecrypt = async () => {
    try {
      setLoading(true);

      if (!password) {
        throw new Error("Password cannot be empty.");
      }

      const encryptedSeedPhrase = localStorage.getItem("wallets");
      
      if (!encryptedSeedPhrase) {
        throw new Error(
          "No encrypted seed phrase found in local storage."
        );
      }

      // Decrypt the seed phrase using the logic function
      const decryptedSeedPhrase = await decryptPhrase(
        encryptedSeedPhrase,
        password
      );

      // Set the decrypted phrase to the state
      setDecryptedPhrase(decryptedSeedPhrase);

      // Clear sensitive data from memory
      setPassword("");
      setError(null);
    } catch (error) {
      let errorMessage =
        "An error occurred while decrypting the seed phrase.";
      if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
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
        {loading && <p>Decrypting...</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        {!decryptedPhrase && (
          <Button variant="primary" onClick={handleDecrypt} disabled={loading}>
            Decrypt and View
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ViewPhrase;
