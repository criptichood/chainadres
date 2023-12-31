// {/* <ViewSeedPhraseModal
// show={showViewSeedPhraseModal}
// seedPhrase={seedPhrase}
// onClose={() => setShowViewSeedPhraseModal(false)}
// onDecrypt={handleDecrypt}
// /> */}
// import React, { useState } from 'react';
// import { Modal, Button, Form, Alert } from 'react-bootstrap';
// import { encrypt, decrypt, generateKey } from '../utils/crypto'; // Import the encryption functions


// interface ViewSeedPhraseModalProps {
//     show: boolean;
//     seedPhrase: string;
//     onClose: () => void;
//     onDecrypt: (password: string) => void;
//   }
  
//   const ViewSeedPhraseModal: React.FC<ViewSeedPhraseModalProps> = ({ show, seedPhrase, onClose, onDecrypt }) => {
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState<string | null>(null); // Store errors
  
//     const handleDecrypt = async () => {
//       if (!password) {
//         setError('Password is required.');
//         return;
//       }
  
//       onDecrypt(password);
//       setPassword('');
//       setError(null);
//     };
  
//     return (
//       <Modal show={show} onHide={onClose}>
//         <Modal.Header closeButton>
//           <Modal.Title style={{ color: 'black' }}>Enter Password</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {error && <Alert variant="danger">{error}</Alert>}
//           <p>Your Seed Phrase:</p>
//           <p>{seedPhrase}</p>
//           <Form.Control
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={onClose}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={handleDecrypt}>
//             Decrypt
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   };