import React, { useState } from 'react';

export default function DonationPage() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with smart contract or backend
    setSuccess(true);
    setAmount('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-4">Donation App</h1>
      <form onSubmit={handleDonate} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <label className="block mb-2 font-medium">Donation Amount (ETH)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
          min="0.01"
          step="0.01"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Donate
        </button>
        {success && (
          <p className="mt-4 text-green-600 font-semibold">Thank you for your donation!</p>
        )}
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Recent Donations</h2>
        {/* TODO: Display recent donations from blockchain or backend */}
        <p className="text-gray-500">No donations yet.</p>
      </div>
    </div>
  );
}
