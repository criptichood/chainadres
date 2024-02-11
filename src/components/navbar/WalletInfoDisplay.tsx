import QRCode from "qrcode.react";
import { Button, Card, Modal, Nav } from "react-bootstrap";
import { z } from "zod";
import './WalletInfoDisplay.css'
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
    <Nav.Item className="wallet-info-display">
      <Nav.Link onClick={handleShowModal}>
        <strong>{selectedWallet}</strong>
        <div className="text-muted">
          {/* {walletAddress && (
            <>
              {walletAddress.substring(0, 6)}...
              {walletAddress.slice(-7)}
            </>
          )} */}
        </div>
      </Nav.Link>
    </Nav.Item>

    <Nav.Item className="balance-info-display">
      <Nav.Link onClick={handleShowModal}>
        <strong>Balance:</strong>
        <span className="ml-2">
          {balance !== null
            ? `${Number(balance).toFixed(3)}`
            : `Unable to load balance`}
        </span>
      </Nav.Link>
    </Nav.Item>

    {/* Modal for wallet address */}
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Wallet Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card>
          <Card.Body>
            <Card.Title>User-Friendly Address</Card.Title>
            <QRCode
              value={walletAddress || ""}
              size={200}
              style={{ border: "1px solid #eee", borderRadius: "8px" }}
            />
            <Card.Text className="mt-3">{walletAddress}</Card.Text>

            <Card.Title>Non-User-Friendly Address</Card.Title>
            <Card.Text>{isNotFriendly}</Card.Text>
          </Card.Body>
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
