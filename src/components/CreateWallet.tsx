// components/CreateWallet.tsx
import React, { useState } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { encrypt, generateKey } from "../utils/crypto";
import CustomToast from "./Toast";

const CreateWallet: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState("DummySeedPhrase");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleShowModal = async () => {
    setShowModal(true);
  };

  const handleCreateWallet = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const key = await generateKey(password);

      await encrypt(seedPhrase, key);

      setPassword("");
      setConfirmPassword("");
      setError(null);
      setShowSuccessToast(true);
      setShowModal(false);
    } catch (error) {
      setError(`Error creating wallet: ${(error as Error).message}`);
    }
  };

  return (
    <>
      <Button onClick={handleShowModal}>Create Wallet</Button>

      <CustomToast
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        message="Wallet created successfully!"
        variant="success"
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "black" }}>Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <p style={{ color: "black" }}>
            Do not lose your seed phrase. Anyone who has your seed phrase can
            access your wallet.
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
    </>
  );
};

export default CreateWallet;
