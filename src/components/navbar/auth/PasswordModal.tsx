// PasswordModal.tsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";

interface PasswordModalProps {
  show: boolean;
  onHide: () => void;
  onPasswordSubmit: (password: string) => void;
  passwordError: string | null; // New prop to receive password error from TonWalletInfo.tsx
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  show,
  onHide,
  onPasswordSubmit,
  passwordError,
}) => {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(passwordError);
  }, [passwordError, password, show]);

  const handleSubmit = async () => {
    try {
      onPasswordSubmit(password);
      setPassword("");
    } catch (error) {
      setError((error as Error).message);
    }
    // Call the onPasswordSubmit callback with the entered password
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    if (password.length >= 6) {
      handleSubmit();
    } else {
      setError("Password is too short");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && password.length >= 6) {
      handleSubmit();
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyPress} // Handle Enter key press
              isInvalid={!!error} // Highlight the input if there's an error
            />
          </Form.Group>
        </Form>
        {error && <Alert variant="danger" style={{ marginTop: "10px" }}>{error}</Alert>}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={password.length < 5}
        >
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PasswordModal;
