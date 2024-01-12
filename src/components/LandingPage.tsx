import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import walletImage from "../assets/img/wallet.jpg";
// import ViewPhrase from './ViewPhrase';

const LandingPageBody: React.FC = () => {
  return (
    <Container className="mt-5 px-3">
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <img
            src={walletImage}
            alt="Wallet"
            className="img-fluid mb-4"
            style={{ maxWidth: "100%", height: "auto" }}
          />
          <h1 className="text-center mb-4">Welcome to Chainadres</h1>
          <p className="text-center mb-4">
            Chainadres is your trusted companion for all your blockchain
            transactions. With our secure and user-friendly interface, managing
            your cryptocurrencies has never been easier. Our wallet allows you
            to send transactions to multiple wallet addresses, optimize gas
            fees, and even upload a CSV file with addresses for transactions.
            All these features are designed to make your experience seamless and
            efficient.
          </p>
          <div className="d-flex justify-content-center">
            <Button variant="primary" size="lg" className="me-md-3 me-1">
              {" "}
              {/* Adjusted button size on mobile */}
              <Link
                to="/create-wallet"
                style={{ color: "white", textDecoration: "none" }}
              >
                Create Wallet
              </Link>
            </Button>
            <Button variant="outline-primary" size="lg">
              <Link
                to="/import-wallet"
                style={{ color: "black", textDecoration: "none" }}
              >
                Import Wallet
              </Link>
            </Button>
            <Button variant="primary" size="lg" className="me-md-3 me-1">
              {" "}
              {/* Adjusted button size on mobile */}
              <Link
                to="/roadmap"
                style={{ color: "white", textDecoration: "none" }}
              >
                RoadMap
              </Link>
            </Button>
            <Button variant="primary" size="lg" className="me-md-3 me-1">
              {" "}
              {/* Adjusted button size on mobile */}
              <Link
                to="/send "
                style={{ color: "white", textDecoration: "none" }}
              >
                Send
              </Link>
            </Button>
          </div>
          {/* <ViewPhrase show={isModalOpen} onClose={function (): void {
            throw new Error('Function not implemented.');
          } } /> */}
        </Col>
      </Row>
    </Container>
  );
};

export default LandingPageBody;
