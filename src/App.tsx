import { ToastContainer } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import CreateWallet from './components/CreateWallet';
import ImportWallet from './components/ImportWallet';
import CryptoWalletTimeline from './roadmap/cryptoWalletTimeline';
import SendTransfer from './components/SendTransfer';


function App() {
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create-wallet" element={<CreateWallet />} />
        <Route path="/import-wallet" element={<ImportWallet />} />
        <Route path='/roadmap' element={<CryptoWalletTimeline />} />
        <Route path='/send' element={<SendTransfer />} />
        {/* ... other routes */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;