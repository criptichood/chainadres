// CreateWallet.tsx
import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { encryptAndSave, generateKeyForCreation } from '../utils/crypto';
import ViewPhrase from './ViewPhrase';

const CreateWallet: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('This is a seed phrase');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showViewPhraseModal, setShowViewPhraseModal] = useState(false);

  const handleShowViewPhraseModal = () => setShowViewPhraseModal(true);
  const handleCloseViewPhraseModal = () => setShowViewPhraseModal(false);

  const handleShowModal = () => setShowModal(true);

  const handleCreateWallet = async () => {
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      // Additional password validation (e.g., length, complexity) can be added here

      // Generate key and obtain salt during wallet creation
      const { derivedKey, salt } = await generateKeyForCreation(password);

      // Encrypt and save seed phrase
      await encryptAndSave(seedPhrase, derivedKey, salt);

      // Clear sensitive data from memory
      setPassword('');
      setConfirmPassword('');
      setSeedPhrase('');
      setError(null);
      setShowModal(false);
    } catch (error) {
      let errorMessage = '';
      switch ((error as Error).message) {
        case 'Passwords do not match.':
          errorMessage = 'Your passwords do not match. Please ensure they are identical.';
          break;
        // Add more cases as needed for other error messages
        default:
          errorMessage = `An unexpected error occurred: ${(error as Error).message}`;
      }
      setError(errorMessage);
    }
  };

  return (
    <>
      <Button onClick={handleShowModal}>Create Wallet</Button>
      <Button onClick={handleShowViewPhraseModal}>View Phrase</Button>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'black' }}>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <p style={{ color: 'black' }}>
            Do not lose your seed phrase. Anyone who has your seed phrase can access your wallet.
          </p>
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
      <ViewPhrase show={showViewPhraseModal} onClose={handleCloseViewPhraseModal} />
    </>
  );
};

export default CreateWallet;
