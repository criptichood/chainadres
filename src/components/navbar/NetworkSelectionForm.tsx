// NetworkSelectionForm.tsx
import { Network } from '@orbs-network/ton-access';
import React from 'react';
import { Form, NavDropdown } from 'react-bootstrap';
import './NetworkSelectionForm.css';
interface NetworkSelectionFormProps {
  network: Network;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const NetworkSelectionForm: React.FC<NetworkSelectionFormProps> = ({ network, onChange }) => {
  return (
    <NavDropdown.Item>
      <Form  >
        <Form.Select aria-label="Network selection" onChange={onChange} value={network} style={  { backgroundColor: '#f8f9fa' }  } className="custom-select" >
          <option value="mainnet">Mainnet</option>
          <option value="testnet">Testnet</option>
        </Form.Select>
      </Form>
    </NavDropdown.Item>
  );
};

export default NetworkSelectionForm;

