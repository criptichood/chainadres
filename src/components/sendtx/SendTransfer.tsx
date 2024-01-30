import React, { useState, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { sendTransaction, Recipient, TransactionResult } from '../../scripts/sendTransaction';
import Papa from 'papaparse';

export default function SendTransfer() {
  const [address, setAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [value, setValue] = useState<string>('0.001');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [displayAddress, setDisplayAdress] = useState<string>('');
  const [failedAddresses, setFailedAddresses] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileUploadKey, setFileUploadKey] = useState<number>(0);

  const handleClose = () => setIsModalOpen(false);

  const handleCancelTransaction = () => {
    // Logic to cancel the transaction (if applicable)
    // You can implement this based on your requirements
    handleClose();
  };
// Define an interface for your CSV data
interface CsvRow {
  address?: string;
  
  // Add more properties if needed
}

//Handle file uploads

const handleFileUpload = () => {
  if (fileInputRef.current && fileInputRef.current.files) {
    const file = fileInputRef.current.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csvData = e.target?.result as string;
        const parsedData = Papa.parse<CsvRow>(csvData, { header: true });

        const addresses = parsedData.data
          .filter((row) => typeof row === 'object' && row !== null)
          .map((row) => Object.values(row)[0]?.trim())
          .filter((address) => typeof address === 'string' && address.trim() !== '');

        if (addresses.length > 0) {
          setAddress(addresses.join(','));
          console.log('Addresses after upload:', addresses.join(','));
        } else {
          setAddress('');
          console.log('No addresses found in the file.');
        }

        // Increment the key to trigger a re-render and refresh the UI
        setFileUploadKey((prevKey) => prevKey + 1);
      };
      reader.readAsText(file);
    }
  }
};

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const addresses = address.split(',').map((address) => address.trim());
  const recipients: Recipient[] = addresses.map((to) => ({ to, value, body: message }));

  try {
    // Open modal immediately after sending transaction
    setIsModalOpen(true);
    const result = await sendTransaction(recipients, handleProgress);
    setTransactionResult(result);

    if (result.success) {
      // Reset input fields after successful transactions
      setAddress('');
      setMessage('');
      setValue('0.001');
    } else {
      // Update the address field with failed addresses in their ready-to-send format
      const failedAddresses = result.failedAddresses?.join(',') || '';
      setAddress(failedAddresses);
    }
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
};



  const handleProgress = (
    current: number,
    total: number,
    confirmationMessage: string,
    displayaddress: string,
    failedAddresses: string[]
  ) => {
    console.log(confirmationMessage);
    setConfirmationMessage(confirmationMessage);
    setFailedAddresses(failedAddresses);
    setDisplayAdress(displayaddress)
    // You can update UI with the progress information if needed
  };
  return (
    <section key={fileUploadKey} className="py-5">
    <div className="row mb-5">
      <div className="col-md-8 col-xl-6 text-center mx-auto">
        <h2 className="fw-bold">Send Transactions</h2>
      </div>
    </div>
    <div className="row d-flex justify-content-center">
      <div className="col-md-6 col-xl-4">
      <div className="mb-3">
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
      </div>
        <form className="p-3 p-xl-4" onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="border-success shadow form-control"
              id="message-2"
              name="address"
              rows={6}
              placeholder="Comma separated address"
              style={{ marginBottom: '23px' }}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              wrap="soft"
              title="The address field now enables the sending of transactions to multiple wallet addresses, simply by separating each address with a comma."
            />
          </div>
          <div className="mb-3">
            <textarea
              className="border-secondary shadow form-control"
              id="message-1"
              name="message"
              rows={6}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              title="The identical message will be sent in the case of multiple addresses."
            />
          </div>
          <div className="mb-3">
            <input
              className="border-success form-control"
              type="text"
              id="email-1"
              name="value"
              placeholder="Default 0.001"
              style={{ marginBottom: '27px' }}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              title="The identical message will be sent in the case of multiple addresses."
            />
          </div>
          <div>
            <button className="btn btn-primary shadow d-block w-100" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>

     {/* Modal for displaying transaction status */}
     <Modal show={isModalOpen} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Transaction Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Your modal body content */}
          {transactionResult?.success ? (
            <>
              <p className="text-dark">Successfully Sent Transactions!</p>
              <p className="text-dark">Results: {transactionResult?.successCount}</p>
              {/* Display details for each chunk of recipients */}
              {failedAddresses.length > 0 && (
                <>
                  <p className="text-danger">Failed Addresses:</p>
                  <ul className="text-dark">
                    {failedAddresses.map((failedAddress) => (
                      //might need more check for same address in a file 
                      <li key={failedAddress}>{failedAddress}</li>
                    ))}
                  </ul>
                </>
              )}
              {/* Display progress information */}
              {confirmationMessage && (
                <div className="text-success">
                <p>{confirmationMessage}</p>
                <p>{displayAddress}</p>
                </div>
                
              )}
            </>
          ) : (
            <p className="text-danger">Transaction(s) failed: {transactionResult?.errorMessage}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleClose}>
            Close
          </Button>
          
            <Button variant="danger" onClick={handleCancelTransaction}>
              Cancel
            </Button>
          
        </Modal.Footer>
      </Modal>
    </section>
  );
}
