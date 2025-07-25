import React from 'react';

// TODO: Replace with real event fetching logic
const mockEvents = [
  { sender: '0x123...', amount: '0.5', message: 'Keep up the great work!' },
  { sender: '0x456...', amount: '1.0', message: 'Happy to help!' },
];

export default function DonationEvents() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold mb-2">Donation Events</h3>
      <ul>
        {mockEvents.map((event, idx) => (
          <li key={idx} className="mb-2">
            <span className="font-mono text-blue-700">{event.sender}</span> donated <span className="font-semibold">{event.amount} ETH</span>
            <span className="block text-gray-600 ml-2">{event.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
