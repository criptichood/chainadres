// CreateWallet.tsx
// CreateWallet.tsx

import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Alert, Card, CardBody, ListGroup } from 'react-bootstrap';
import { encryptAndSave, generateKeyForCreation } from '../utils/crypto';
import { generateValidMnemonic } from '../utils/mnemonicUtils';
import { verifyPasswordStrength } from '../utils/passwordUtils';
import ViewPhrase from './ViewPhrase';

const CreateWallet: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [seedPhrase, setSeedPhrase] = useState<string | null>(
    " "
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showViewPhraseModal, setShowViewPhraseModal] = useState(false);

  const handleShowViewPhraseModal = () => setShowViewPhraseModal(true);
  const handleCloseViewPhraseModal = () => setShowViewPhraseModal(false);

  const handleShowModal = () => setShowModal(true);
//Mnemonic Generation
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

  const handleCreateWallet = async () => {
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.');
      }

      // Additional password validation
      if (!verifyPasswordStrength(password)) {
        throw new Error('Password does not meet the required strength criteria.');
      }

      // Generate key and obtain salt during wallet creation
      const { derivedKey, salt } = await generateKeyForCreation(password);
      
      // Get the existing wallets from localStorage
      const existingWallets = JSON.parse(localStorage.getItem('wallets') || '[]');
        console.log(existingWallets)
      // Encrypt and save seed phrase
      console.log("Before encryption: ",seedPhrase)
    await encryptAndSave(`Wallet${existingWallets.length}`, seedPhrase!, derivedKey, salt);
      // Clear sensitive data from memory
      setPassword('');
      setConfirmPassword('');
      setSeedPhrase(null);
      setError(null);
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
      <Button onClick={handleShowViewPhraseModal}>View Phrase</Button>
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
          {/* DisplayPhrase */}
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
      <ViewPhrase
        show={showViewPhraseModal}
        onClose={handleCloseViewPhraseModal}
      />
    </>
  );
};

export default CreateWallet;

//short list of useful github commands to remember