// TonWalletInfo.tsx
import "../../assets/bootstrap/css/bootstrap.min.css";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import PasswordModal from "./auth/PasswordModal";
import NetworkSelectionForm from "./NetworkSelectionForm";
import WalletInfoDisplay from "./WalletInfoDisplay";
import WalletSelectDropdown from "./WalletSelectDropdown";
import useBalanceService from "./BalanceService";
import useWalletData from "../hooks/useWalletData";
import { saveConfig } from "../../config/config";
import logo from "../../assets/logo/chianinterlink.svg";
import { Link } from "react-router-dom";
import { Network } from "@orbs-network/ton-access";

import { useEffect, useState } from "react";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import { decryptPhrase } from "../../utils/decrypt";

const TonWalletInfo: React.FC = () => {
  const [balance, setBalance] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [isNotFriendly, setIsNotFriendly] = useState<string | null>(null);
const [password, setPassword] = useState<string>('');
const [passwordError, setPasswordError] = useState<string | null>(null);
  const { wallets, selectedWallet, network, setSelectedWallet, setNetwork } =
    useWalletData();
    const handlePasswordSubmit = async (password: string) => {
      // Handle the submitted password, you can use it for decryption or any other logic
    
      setPassword(password);
    };

    //Unlock wallet if password is entered
    useEffect(() => {
      const fetchData = async () => {
        try {
          if (wallets.length > 0 && selectedWallet) {
            const foundWallet = wallets.find((wallet) => wallet.id === selectedWallet);
  
            if (foundWallet) {
              // Check if the user is signed in and show the password modal if not
              if (walletAddress === null && password === '' && !showPasswordModal) {
                setShowPasswordModal(true);
                return;
              }
            
              // Check if password is not null before proceeding
              if (password !== null && password !== '') {
                const mnemonic = await decryptPhrase(selectedWallet, password);
  
                if (mnemonic) {
                  // Decrypt wallet and set wallet address as before
                  const key = await mnemonicToWalletKey(mnemonic.split(" "));
                  const wallet = WalletContractV4.create({
                    publicKey: key.publicKey,
                    workchain: 0,
                  });
  
                  const addressOptions =
                    network === "mainnet"
                      ? {}
                      : { bounceable: false, testOnly: true };
                  setWalletAddress(wallet.address.toString(addressOptions));
                  setIsNotFriendly(wallet.address.toRawString());
                  // Clear sensitive data from state
                  setShowPasswordModal(false);
                  setPassword('');
                  
                } else {
              //    console.error("Mnemonic is null! Unable to decrypt wallet.");
                }
              } else {
                // Handle the case where the password is null (user canceled input)
               // console.error("Password is not provided or user canceled request.");
              }   
              
            }
          }
        } catch (error) {
          //console.error("Error:", (error as Error).message);
          setPasswordError((error as Error).message);
        }
      };
  
      fetchData();
    }, [network, wallets, selectedWallet, walletAddress, showPasswordModal, password]);
  

  // get balance
  useBalanceService({
    network,
    walletAddress,
    onUpdate: (newBalance) => setBalance(newBalance),
  });

  const handleNetworkChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedNetwork = event.target.value as Network;
    setNetwork(selectedNetwork);

    saveConfig("selectedNetwork", selectedNetwork);

    try {
      if (wallets.length > 0 && selectedWallet) {
        const foundWallet = wallets.find(
          (wallet) => wallet.id === selectedWallet
        );

        if (foundWallet) {
          setShowPasswordModal(true); // Prompt the user for the password when changing the network
        }
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  

  const handleWalletSelect = (walletId: string) => {
    setSelectedWallet(walletId);
    saveConfig("selectedWallet", walletId);
    setShowPasswordModal(true);
  };
const handleShowModal = () =>{
  setShowModal(true);
}
  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress || "");
      // Optionally, you can show a notification or perform other actions on successful copy
    } catch (error) {
      console.error("Error copying address:", (error as Error).message);
      // Handle clipboard write error, e.g., show an error message to the user / send to state
    }
  };

  const hasSelectedWallet = selectedWallet !== null;

  return (
    <>
      <PasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        onPasswordSubmit={handlePasswordSubmit}
        passwordError={passwordError}
      />
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
            {hasSelectedWallet ? (
              <>
                <WalletSelectDropdown
                  wallets={wallets}
                  onSelect={handleWalletSelect}
                />
                <Nav className="justify-content-center">
                  <WalletInfoDisplay
                    selectedWallet={selectedWallet}
                    walletAddress={walletAddress}
                    isNotFriendly={isNotFriendly}
                    balance={balance}
                    show={showModal}
                    handleShowModal={handleShowModal}
                    onHide={() => setShowModal(false)}
                    onCopyAddress={handleCopyAddress}
                  />
                </Nav>
                <Nav>
                  <NetworkSelectionForm
                  network={network}
                  onChange={handleNetworkChange}
                />
                </Nav>
                
              </>
            ) : (
              <Container>
                <Nav className="justify-content-end">
                  <Nav.Item>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-md-3 me-1"
                    >
                      {" "}
                      {/* Adjusted button size on mobile */}
                      <Link
                        to="/create-wallet"
                        style={{ color: "white", textDecoration: "none" }}
                      >
                        Create Wallet
                      </Link>
                    </Button>
                  </Nav.Item>
                </Nav>
              </Container>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default TonWalletInfo;
