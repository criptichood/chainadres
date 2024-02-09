import QRCode from "qrcode.react";
import { Button, Card, CardBody, Modal, Nav, NavDropdown } from "react-bootstrap";
import { z } from "zod";

// Define Zod schema for the props
const WalletInfoDisplayPropsSchema = z.object({
  selectedWallet: z.string().nullable(),
  walletAddress: z.string().nullable(),
  isNotFriendly: z.string().nullable(),
  balance: z.string().nullable(),
  show: z.boolean(),
  handleShowModal: z.function(),
  onHide: z.function(),
  onCopyAddress: z.function(),
});

type WalletInfoDisplayProps = z.infer<typeof WalletInfoDisplayPropsSchema>;

const WalletInfoDisplay: React.FC<WalletInfoDisplayProps> = ({
  selectedWallet,
  walletAddress,
  isNotFriendly,
  balance,
  show,
  handleShowModal,
  onHide,
  onCopyAddress,
}) => {
  // Zod validation
  WalletInfoDisplayPropsSchema.parse({
    selectedWallet,
    walletAddress,
    isNotFriendly,
    balance,
    show,
    handleShowModal,
    onHide,
    onCopyAddress,
  });

  return (
    <>
      <Nav.Item>
        <NavDropdown.Item>
          {selectedWallet}
          <div onClick={handleShowModal}>
            {walletAddress && (
              <>
                {walletAddress.substring(0, 6)}...
                {walletAddress.slice(-7)}
              </>
            )}
          </div>
        </NavDropdown.Item>
      </Nav.Item>
      <Nav.Item>
        <NavDropdown.Item>
          <strong>Balance:</strong>
          <span className="">
            {balance !== null
              ? `${Number(balance).toFixed(3)}`
              : `Unable to load balance`}
          </span>
        </NavDropdown.Item>
      </Nav.Item>
      <NavDropdown.Divider />
      <Nav>{/* Other components related to the wallet info display */}</Nav>
      <Modal
        show={show}
        onHide={onHide} // Corrected the onHide function call
      >
        <Modal.Header closeButton>
          <Modal.Title>Wallet address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <CardBody>
              <Card.Title>User Friendly</Card.Title>
              {/* To use another QR code generator */}
              <QRCode
                value={walletAddress || ""}
                size={200}
                style={{ border: "1px solid #fff", borderRadius: "8px" }}
              />

              <Card.Text>{walletAddress}</Card.Text>
              <Card.Title>Non-User Friendly Address</Card.Title>
              <Card.Text>{isNotFriendly}</Card.Text>
            </CardBody>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" onClick={onCopyAddress}>
            Copy Address
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WalletInfoDisplay;
