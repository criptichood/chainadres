// TonWalletInfo.tsx
import "../../assets/bootstrap/css/bootstrap.min.css";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import PasswordModal from "./auth/PasswordModal";
import NetworkSelectionForm from "./NetworkSelectionForm";
import WalletInfoDisplay from "./WalletInfoDisplay";
import WalletSelectDropdown from "./WalletSelectDropdown";
import useBalanceService from "./BalanceService";
import useWalletData, { Network } from "../hooks/useWalletData";
import { saveConfig } from "../../config/config";
import logo from "../../assets/logo/chianinterlink.svg";
import { Link } from "react-router-dom";
//import { Network } from "@orbs-network/ton-access";
import { z } from "zod";
import { useZodState } from "../hooks/zodUseState";
import { useCallback, useEffect, useState } from "react";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import { decryptPhrase } from "../../utils/decrypt";

// Define Zod schema for the state
const StateSchema = z.object({
  balance: z.string().nullable(),

  showModal: z.boolean(),
  walletAddress: z.string().nullable(),
  isNotFriendly: z.string().nullable(),
  password: z.string(),
  passwordError: z.string().nullable(),
});

const TonWalletInfo: React.FC = () => {
  // Separate state for showPasswordModal
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  // Use the zodUseState hook with the Zod schema
  const [state, setState] = useZodState(StateSchema, {
    balance: null,
    walletAddress: null,
    showModal: false,

    isNotFriendly: null,
    password: "",
    passwordError: null,
  });
  // Extract state variables
  const {
    balance,
    walletAddress,
    showModal,

    isNotFriendly,
    password,
    passwordError,
  } = state;

  const { wallets, selectedWallet, network, setSelectedWallet, setNetwork } =
    useWalletData();

  const fetchData = useCallback(async () => {
    try {
      console.log("fetchData called with", selectedWallet, network);

      if (!selectedWallet || !password) {
        // Do nothing if either selectedWalletId or loadedNetwork is null && password
        setShowPasswordModal(true);
        return;
      }

      if (password !== "" && password !== null && selectedWallet !== null) {
        const mnemonic = await decryptPhrase(selectedWallet, password);

        if (mnemonic) {
          const key = await mnemonicToWalletKey(mnemonic.split(" "));
          const wallet = WalletContractV4.create({
            publicKey: key.publicKey,
            workchain: 0,
          });

          const addressOptions =
            network === Network.Mainnet
              ? {}
              : { bounceable: false, testOnly: true };

          // Update wallet address and related state
          setState((prev) => ({
            ...prev,
            walletAddress: wallet.address.toString(addressOptions),
            isNotFriendly: wallet.address.toRawString(),
            // password: "",
          }));
          setShowPasswordModal(false);
          console.log("it reached here ");
        } else {
          // Handle decryption failure
         
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error
       setState((prev) => ({
            ...prev,
            passwordError: "Mnemonic is null! Unable to decrypt wallet.",
          }));
    }
  }, [network, password, selectedWallet, setState]);

  //need more work to integrate with zod, working without zod was easier because of the state update
  useEffect(() => {
    // Call fetchData only if there is a selectedWallet
    fetchData();
  }, [network, password, selectedWallet]); //falls into infinite loop if fetchData is used
  // Cleanup function

  // get balance
  useBalanceService({
    network,
    walletAddress,
    onUpdate: (newBalance) =>
      setState((prev) => ({ ...prev, balance: newBalance })), //add cleanup after getting balance
  });

  const handlePasswordSubmit = async (enteredPassword: string) => {
    // Handle the submitted password, you can use it for decryption or any other logic
    setState((prev) => ({ ...prev, password: enteredPassword }));
  };
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
          setState((prev) => ({ ...prev, showPasswordModal: true }));
        }
      }
    } catch (error) {
      console.error("Error:", (error as Error).message);
    }
  };

  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId);
    saveConfig("selectedWallet", walletId);
  };

  const handleShowModal = () => {
    setState((prev) => ({ ...prev, showModal: true }));
  };
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
        onHide={() =>
          setState((prev) => ({ ...prev, showPasswordModal: false }))
        }
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
                    onHide={() =>
                      setState((prev) => ({ ...prev, showModal: false }))
                    }
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
