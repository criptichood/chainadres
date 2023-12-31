import { useState } from 'react';
import { Modal, Button, Form, Toast } from 'react-bootstrap';
import CryptoJS from 'crypto-js';

async function decryptSeedPhrase(encryptedSeedPhrase: string, password: string) {
  const bytes = CryptoJS.AES.decrypt(encryptedSeedPhrase, password);
  return bytes.toString(CryptoJS.enc.Utf8);
}

async function encryptSeedPhrase(seedPhrase: string, password: string) {
  return CryptoJS.AES.encrypt(seedPhrase, password).toString();
}

const CreateWallet: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');

  const handleCreateWallet = async () => {
    try {
      const encryptedSeedPhrase = await encryptSeedPhrase(seedPhrase, password);
      // Save the encrypted seed phrase to the browser storage
      localStorage.setItem('seedPhrase', encryptedSeedPhrase);
      // Clear the seed phrase from memory
      setSeedPhrase('');
      setShowToast(true);
      setToastMessage('Wallet created successfully!');
      setToastVariant('success');
    } catch (error) {
      setShowToast(true);
      setToastMessage(`Error creating wallet: ${(error as Error).message}`);
      setToastVariant('danger');
    }
  };

  const handleViewSeedPhrase = async () => {
    try {
      const encryptedSeedPhrase = localStorage.getItem('seedPhrase');
      if (!encryptedSeedPhrase) return;
      const decryptedSeedPhrase = await decryptSeedPhrase(encryptedSeedPhrase, password);
      setSeedPhrase(decryptedSeedPhrase);
      setShowToast(true);
      setToastMessage('Seed phrase decrypted successfully!');
      setToastVariant('success');
    } catch (error) {
      setShowToast(true);
      setToastMessage(`Error decrypting seed phrase: ${(error as Error).message}`);
      setToastgit Variant('danger');
    }
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Create Wallet</Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Do not lose your seed phrase. Anyone who has your seed phrase can access your wallet.</p>
          <Form.Check type="checkbox" label="I accept the terms of service" checked={acceptedTerms} onChange={() => setAcceptedTerms(!acceptedTerms)} />
          <Form.Control type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCreateWallet}>Create Wallet</Button>
          <Button variant="primary" onClick={handleViewSeedPhrase}>View Seed Phrase</Button>
        </Modal.Footer>
      </Modal>

      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          minWidth: 200,
        }}
      >
        <Toast.Body style={{backgroundColor: toastVariant === 'danger' ? 'red' : 'green'}}>
          
            {toastMessage}
          
        </Toast.Body>
      </Toast>
    </>
  );
};

export default CreateWallet;
