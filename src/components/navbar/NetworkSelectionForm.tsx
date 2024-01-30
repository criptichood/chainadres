// NetworkSelectionForm.tsx
import { Network } from '@orbs-network/ton-access';
import React from 'react';
import { Form, NavDropdown } from 'react-bootstrap';

interface NetworkSelectionFormProps {
  network: Network;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const NetworkSelectionForm: React.FC<NetworkSelectionFormProps> = ({ network, onChange }) => {
  return (
    <NavDropdown.Item>
      <Form className="ms-3">
        <Form.Select aria-label="Network selection" onChange={onChange} value={network}>
          <option value="mainnet">Mainnet</option>
          <option value="testnet">Testnet</option>
        </Form.Select>
      </Form>
    </NavDropdown.Item>
  );
};

export default NetworkSelectionForm;

