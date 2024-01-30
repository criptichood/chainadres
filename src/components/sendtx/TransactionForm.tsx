/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { sendTransaction, Recipient, TransactionResult } from '../../scripts/sendTransaction'; // Import your TypeScript code
import '../assets/styles/tsForm.css'
const TransactionForm: React.FC = () => {
  const [recipientAddresses, setRecipientAddresses] = useState<string>('');
  const [value, setValue] = useState<string>('0.001'); // Default value
  const [body, setBody] = useState<string>('Input it'); // Default body
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TransactionResult | null>(null);

  const handleSendTransaction = async () => {
    setLoading(true);

    const recipients: Recipient[] = recipientAddresses
      .split(',')
      .map((address) => ({ to: address.trim(), value, body }));

      try {
        const response = await sendTransaction(recipients, (current, total, confirmationMessage, failedAddresses) => {
          console.log(confirmationMessage);
        // You can update your UI here with the confirmation message
        // e.g., append messages to a log, update a progress bar, etc.
        // For simplicity, we log it to the console in this example.

        if (failedAddresses.length > 0) {
          console.log('Failed Addresses:', failedAddresses);
        }
      });

      setResult(response);
      if (response.success) {
        console.log(`Successfully sent ${response.successCount} transactions.`);
      } else {
        console.error(`Transaction failed: ${response.errorMessage}`);
      }
    } catch (error: any) {
      console.error('Error sending transaction:', error.message);
      setResult({ success: false, errorMessage: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='tx-container'>
      <h2>Send Transaction</h2>
      <div className="input-group">
      <label className="input-group-label" htmlFor="label">
        Recipient Addresses:</label>
        <input
          type="text" id="myInput" className="input-group__input"
          value={recipientAddresses}
          onChange={(e) => setRecipientAddresses(e.target.value)}
        />
      
      </div>
      <div className="input-group">
      <label className="input-group-label" htmlFor="label">
        Value:</label>
        <input
          type="text" id="myInput" className="input-group__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="input-group">
      <label className="input-group-label" htmlFor="label">
        Body</label>
        <input
          type="text" id="myInput" className="input-group__input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <button onClick={handleSendTransaction} disabled={loading}>
        {loading ? 'Sending...' : 'Send Transaction'}
      </button>
      {result && (
        <div>
          <p>
            {result.success
              ? `Transaction successful! Sent ${result.successCount} transactions.`
              : `Transaction failed: ${result.errorMessage}`}
          </p>
        </div>
      )}
      </div>
    
  );
};

export default TransactionForm;
