import React, { useState } from 'react';
import { Button, Nav, Offcanvas} from 'react-bootstrap';
import { FiShield, FiBookOpen, FiHelpCircle, FiMessageSquare, FiInfo, FiUser, FiRefreshCw, FiLink, FiSearch } from 'react-icons/fi';
// Example of importing an icon from the 'react-icons' library
import { FaBeer } from 'react-icons/fa'; // Using Font Awesome
interface SidebarProps {
  show: boolean;
  onHide: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ show, onHide }) => {
  const [placement, setPlacement] = useState<'start' | 'end'>('start');

  const handlePlacementChange = (value: 'start' | 'end') => {
    setPlacement(value);
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement={placement} className="bg-dark text-white" style={{ width: '250px' }}>
    <Offcanvas.Header closeButton>
      <Offcanvas.Title>Menu</Offcanvas.Title>
    </Offcanvas.Header>
    <Offcanvas.Body>
      {/* Toggle button to switch placement */}
      <div className="mb-2 d-flex justify-content-center">
        <Button
          variant={placement === 'start' ? 'outline-light' : 'light'}
          onClick={() => handlePlacementChange('start')}
        >
          Left
        </Button>
        <Button
          variant={placement === 'end' ? 'outline-light' : 'light'}
          onClick={() => handlePlacementChange('end')}
          className="ml-1"
        >
          Right
        </Button>
      </div>

      <Nav className="flex-column">
        {/* User profile */}
        <Nav.Link href="#profile">
          <FiUser className="mr-2" /> Profile
        </Nav.Link>

        {/* Wallet-related options */}
        <Nav.Link href="#wallet">
          <FaBeer className="mr-2" /> Wallet
        </Nav.Link>
        <Nav.Link href="#swap">
          <FiRefreshCw className="mr-2" /> Swap
        </Nav.Link>
        <Nav.Link href="#bridge">
          <FiLink className="mr-2" /> Bridge
        </Nav.Link>
        <Nav.Link href="#discover">
          <FiSearch className="mr-2" /> Discover
        </Nav.Link>

        {/* Other options */}
        <Nav.Link href="#security">
          <FiShield className="mr-2" /> Security
        </Nav.Link>
        <Nav.Link href="#address-book">
          <FiBookOpen className="mr-2" /> Address Book
        </Nav.Link>
        <Nav.Link href="#help">
          <FiHelpCircle className="mr-2" /> Help
        </Nav.Link>
        <Nav.Link href="#support">
          <FiMessageSquare className="mr-2" /> Support
        </Nav.Link>
        <Nav.Link href="#about">
          <FiInfo className="mr-2" /> About
        </Nav.Link>
      </Nav>
    </Offcanvas.Body>
  </Offcanvas>
  );
};

export default Sidebar;
