// HDWalletGeneratorUI.tsx
import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { generateNewHDWallet } from './HDWalletGenerator';
import {
    mnemonicNew,
  
    
  } from '../ton-crypto/src/mnemonic/mnemonic'

const HDWalletGeneratorUI: React.FC = () => {
  const [newMnemonic, setNewMnemonic] = useState<string[]>([]);
  const [sequentialIndex, setSequentialIndex] = useState<number>(0);
  const [newWalletAddress, setNewWalletAddress] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const handleGenerateWallet = async () => {
    try {
      // Generate new mnemonic
      const mnemonicArray: string[] = await mnemonicNew();
      setNewMnemonic(mnemonicArray);

      // Increment the sequential index for each new wallet
      const newIndex: number = sequentialIndex + 1;
      setSequentialIndex(newIndex);

      // Generate new HD wallet and get the wallet address and private key
      const { address, privateKey } = await generateNewHDWallet(mnemonicArray, newIndex);

      // Set the new wallet address and private key
      setNewWalletAddress(address);
      setPrivateKey(privateKey);
    } catch (error) {
      // Handle errors
      console.error('Error:', (error as Error).message);
    }
  };

  return (
    <Container>
      <h2 className="mt-4">HD Wallet Generator</h2>
      <Row>
        <Col md={6}>
          <Form.Group controlId="newMnemonic">
            <Form.Label>New Mnemonic:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newMnemonic.join(' ')}
              readOnly
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="indexInput">
            <Form.Label>Sequential Index:</Form.Label>
            <Form.Control
              type="number"
              value={sequentialIndex}
              onChange={(e) => setSequentialIndex(Number(e.target.value))}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" onClick={handleGenerateWallet}>
        Generate New Wallet
      </Button>
      {newWalletAddress && (
        <div className="mt-4">
          <h3>New Wallet Address:</h3>
          <p>{newWalletAddress}</p>
        </div>
      )}
      {privateKey && (
        <div className="mt-4">
          <h3>Private Key:</h3>
          <p>{privateKey}</p>
        </div>
      )}
    </Container>
  );
};

export default HDWalletGeneratorUI;
