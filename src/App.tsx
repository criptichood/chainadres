import { ToastContainer } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import TonWalletInfo from "./components/navbar/TonWalletInfo";
import Footer from "./components/footer/Footer";
import LandingPage from "./components/LandingPage";
import CreateWallet from "./components/createWallet/CreateWallet";
import ImportWallet from "./components/importWallet/ImportWallet";
import CryptoWalletTimeline from "./roadmap/cryptoWalletTimeline";
import SendTransfer from "./components/sendtx/SendTransfer";

const App: React.FC = () => {
  return (
    <div>
      <ToastContainer />
      <TonWalletInfo />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/import-wallet" element={<ImportWallet />} />
        <Route path="/roadmap" element={<CryptoWalletTimeline />} />
        <Route path="/send" element={<SendTransfer />} />
        {/* ... other routes */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
