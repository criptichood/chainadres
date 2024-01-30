// WalletSelectDropdown.tsx
import React from 'react';
import { NavDropdown } from 'react-bootstrap';

interface Wallet {
    id: string;
    // Add other properties as needed
  }
interface WalletSelectDropdownProps {
  wallets: Wallet[];
  onSelect: (walletId: string) => void;
}

const WalletSelectDropdown: React.FC<WalletSelectDropdownProps> = ({ wallets, onSelect }) => {
  return (
    <NavDropdown title="Select Wallet" id="basic-nav-dropdown">
      {wallets.map((wallet: Wallet) => (
        <NavDropdown.Item key={wallet.id} onClick={() => onSelect(wallet.id)}>
          {wallet.id}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default WalletSelectDropdown;
