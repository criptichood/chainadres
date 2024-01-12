// Navbar.tsx
import "../assets/bootstrap/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Network } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import {
  Form,
  Button,
  Modal,
  Card,
  CardBody,
  Navbar,
  Container,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import QRCode from "qrcode.react"; 
import useBalanceService from "./BalanceService";
import logo from "../assets/logo/chianinterlink.svg";
import { decryptPhrase } from "../utils/decrypt";


const TonWalletInfo: React.FC = () => {

  const [balance, setBalance] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [network, setNetwork] = useState<Network>("mainnet");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isNotFriendly, setIsNotFriendly] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [password,setPassword] = useState<string>('22savage')

  // Existing wallets from localStorage
  const existingWallets = JSON.parse(localStorage.getItem("wallets") || "[]");

 // get balance
  useBalanceService({
    network,
    walletAddress,
    onUpdate: (newBalance) => setBalance(newBalance),
  });

const handleNetworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNetwork(event.target.value as Network);
  };
  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress || "");
      // Optionally, you can show a notification or perform other actions on successful copy
    } catch (error) {
      console.error("Error copying address:", (error as Error).message);
      // Handle clipboard write error, e.g., show an error message to the user
    }
  };
  interface Wallet {
    id: string;
    // Add other properties as needed
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ... (existing code)
 interface Wallet {
      id: string;
      // Add other properties as needed
    }
        if (existingWallets.length > 0) {
          const foundWallet = existingWallets.find(
            (wallet: Wallet) => wallet.id === selectedWallet
          );
         
          if (foundWallet) {
            // Decrypt the seed phrase using the stored encryptedSeed
            const mnemonic = await decryptPhrase(
              selectedWallet,
              password
            );

           
          //  console.log("Decrypted Seed Phrase:", mnemonic);

            if (mnemonic) {
            // console.log(mnemonic)
              const key = await mnemonicToWalletKey(mnemonic.split(" "));
              const wallet = WalletContractV4.create({
              publicKey: key.publicKey,
              workchain: 0,
              });
              // Set options based on the network
            const addressOptions = network === "mainnet" ? {} : { bounceable: false, testOnly: true };
            setWalletAddress(wallet.address.toString(addressOptions));  
            setIsNotFriendly(wallet.address.toRawString());

            } else {
              console.error("Mnemonic is null");
            }
          }
        }
      } catch (error) {
        console.error("Error:", (error as Error).message);
      }
    };

    fetchData();
  }, [network, existingWallets, selectedWallet]);

  

  return (
    <>
        <Navbar expand="lg" bg="body-tertiary" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt="No Logo"
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            {" Chainadres"}
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <NavDropdown title="Select Wallet" id="basic-nav-dropdown">
                {existingWallets.map((wallet: Wallet) => (
                  <NavDropdown.Item
                    key={wallet.id}
                    onClick={() => handleWalletSelect(wallet.id)}
                  >
                    {wallet.id}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>

            <Nav>
              <Nav.Link onClick={handleShowModal}>
                <Nav.Link>
                  {selectedWallet}
                </Nav.Link>
                {walletAddress && (
                  <>
                    {walletAddress.substring(0, 6)}...{walletAddress.slice(-7)}
                  </>
                )}
              </Nav.Link>

              <Nav.Link>
                {balance !== null
                  ? `Balance: ${Number(balance).toFixed(3)} `
                  : `Unable to load balance: `}
              </Nav.Link>

              <Form>
                <Form.Select
                  aria-label="Network selection"
                  onChange={handleNetworkChange}
                  value={network}
                  className="ms-2"
                >
                  <option value="mainnet">Mainnet</option>
                  <option value="testnet">Testnet</option>
                </Form.Select>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Wallet address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <CardBody>
              <Card.Title>User Friendly</Card.Title>
              <QRCode
  value={walletAddress || ""}
  size={64}
  style={{ border: "2px solid #000000", borderRadius: "8px" }}
/>

              <Card.Text>{walletAddress}</Card.Text>
              <Card.Title>Non-User Friendly Address</Card.Title>
              <Card.Text>{isNotFriendly}</Card.Text>
            </CardBody>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCopyAddress}>
            Copy Address
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    //
    // <>
    //     <nav className="navbar navbar-dark navbar-expand-md sticky-top navbar-shrink py-3" id="mainNav">
    //     <div className="container"><a className="navbar-brand d-flex align-items-center" href="/"><span className="bs-icon-sm bs-icon-circle bs-icon-primary shadow d-flex justify-content-center align-items-center me-2 bs-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-bezier">
    //                     <path fill-rule="evenodd" d="M0 10.5A1.5 1.5 0 0 1 1.5 9h1A1.5 1.5 0 0 1 4 10.5v1A1.5 1.5 0 0 1 2.5 13h-1A1.5 1.5 0 0 1 0 11.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zm10.5.5A1.5 1.5 0 0 1 13.5 9h1a1.5 1.5 0 0 1 1.5 1.5v1a1.5 1.5 0 0 1-1.5 1.5h-1a1.5 1.5 0 0 1-1.5-1.5v-1zm1.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1zM6 4.5A1.5 1.5 0 0 1 7.5 3h1A1.5 1.5 0 0 1 10 4.5v1A1.5 1.5 0 0 1 8.5 7h-1A1.5 1.5 0 0 1 6 5.5v-1zM7.5 4a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1z"></path>
    //                     <path d="M6 4.5H1.866a1 1 0 1 0 0 1h2.668A6.517 6.517 0 0 0 1.814 9H2.5c.123 0 .244.015.358.043a5.517 5.517 0 0 1 3.185-3.185A1.503 1.503 0 0 1 6 5.5v-1zm3.957 1.358A1.5 1.5 0 0 0 10 5.5v-1h4.134a1 1 0 1 1 0 1h-2.668a6.517 6.517 0 0 1 2.72 3.5H13.5c-.123 0-.243.015-.358.043a5.517 5.517 0 0 0-3.185-3.185z"></path>
    //                 </svg></span><span>chainadres</span></a><button data-bs-toggle="collapse" className="navbar-toggler" data-bs-target="#navcol-1"><span className="visually-hidden">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
    //         <div className="collapse navbar-collapse ms-sm-0" id="navcol-1">
    //             <ul className="navbar-nav mx-auto">
    //                 <li className="nav-item"></li>
    //                 <li className="nav-item"></li>
    //                 <li className="nav-item"><a className="nav-link" href="team.html">Acknowledgements</a></li>
    //                 <li className="nav-item"><a className="nav-link" href="contacts.html">Contacts</a></li>
    //                 <li className="nav-item"></li>
    //             </ul><a href="contacts.html" className=""><strong><span className="">Balance:&nbsp;</span></strong><span>200 imageHere</span><span></span></a>
    //         </div>
    //     </div>
    //     <hr />
    // </nav>

    // </>
  );
};

export default TonWalletInfo;
