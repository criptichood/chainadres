/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { sendTransaction, Recipient, TransactionResult } from '../scripts/sendTransaction';

export default function SendTransfer() {
  const [address, setAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [value, setValue] = useState<string>('0.001');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);

  const handleCancelTransaction = () => {
    // Logic to cancel the transaction (if applicable)
    // You can implement this based on your requirements
    setIsModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const addresses = address.split(',').map((address) => address.trim());
    const recipients: Recipient[] = addresses.map((to) => ({ to, value, body: message }));

    try {
      const result = await sendTransaction(recipients, handleProgress);
      setTransactionResult(result);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };

  const handleProgress = (
    current: number,
    total: number,
    confirmationMessage: string,
    failedAddresses: string[]
  ) => {
    console.log(confirmationMessage);
    // You can update UI with the progress information if needed
  };

  return (
    <section className="py-5">
      <div className="row mb-5">
        <div className="col-md-8 col-xl-6 text-center mx-auto">
          <h2 className="fw-bold">Send Transactions</h2>
        </div>
      </div>
      <div className="row d-flex justify-content-center">
        <div className="col-md-6 col-xl-4">
        
      <form className="p-3 p-xl-4" onSubmit={handleSubmit}>
        
      <div className="mb-3"></div>
              <textarea
                className="border-success shadow form-control"
                data-bs-toggle="tooltip"
                data-bss-tooltip=""
                data-bs-placement="left"
                id="message-2"
                name="address"
                rows={6}
                placeholder="Comma separated address"
                style={{ marginBottom: '23px' }}
                wrap="soft"
                title="The address field now enables the sending of transactions to multiple wallet addresses, simply by separating each address with a comma."
              ></textarea>
              <div className="mb-3"></div>
              <div className="mb-3">
                <textarea
                  className="border-secondary shadow form-control"
                  data-bs-toggle="tooltip"
                  data-bss-tooltip=""
                  data-bs-placement="left"
                  id="message-1"
                  name="message"
                  rows={6}
                  placeholder="Message"
                  title="The identical message will be sent in the case of multiple addresses."
                ></textarea>
              </div>
              <input
                className="border-success form-control"
                type="email"
                data-bs-toggle="tooltip"
                data-bss-tooltip=""
                data-bs-placement="left"
                id="email-1"
                name="value"
                placeholder="Default 0.001"
                style={{ marginBottom: '27px' }}
                
                title="The identical message will be sent in the case of multiple addresses."
              />
              <div>
                <button className="btn btn-primary shadow d-block w-100" type="submit">
                  Send
                </button>
              </div>
            </form>
          </div></div>

      {/* Modal for displaying transaction status */}
      {isModalOpen && transactionResult && (
        <div className="modal fade" role="dialog" tabIndex={-1} id="modal-1">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title text-dark">&nbsp;Transaction Status</h4>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} aria-label="Close"></button>
              </div>
              <div className="modal-body">
      {transactionResult.success ? (
        <>
          <p className="text-dark">Transaction(s) successful!</p>
          <p className="text-dark">Total successful transactions: {transactionResult.successCount}</p>
          {/* Check if failedAddresses is defined before mapping */}
          {transactionResult.failedAddresses && transactionResult.failedAddresses.length > 0 && (
            <>
              <p className="text-danger">Failed Addresses:</p>
              <ul>
                {transactionResult.failedAddresses.map((failedAddress) => (
                  <li key={failedAddress}>{failedAddress}</li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <p className="text-danger">Transaction(s) failed: {transactionResult.errorMessage}</p>
      )}
    </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => setIsModalOpen(false)}
                  title="Transactions will continue processing in the background."
                >
                  Close
                </button>
                {/* Conditionally render the Cancel button based on your cancelation logic */}
                {transactionResult.success && (
                  <button
                    className="btn btn-danger"
                    onClick={handleCancelTransaction}
                    title="Note: Only uncommitted transactions can be canceled; transactions already picked up by validators on the blockchain cannot be canceled."
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>


  );
}
