'use client';

import { useEffect, useState } from 'react';

export default function WebhookViewer() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Function to send dummy webhook
  const sendTestWebhook = async () => {
    const dummyPayload = {
      id: "99999",
      name: "Demo Trigger Corp",
      email: "demo@trigger.com",
      website: "https://trigger.test",
      offeredshare: "5% Equity",
      whyTarget: "Test view-webhooks trigger",
      whyNow: "Just testing",
      anticipatedOrderValue: 42000,
      anticipatedCommission: 3200,
      anticipatedROI: "3x in 1 year",
      receivedFrom: "View Webhooks Page",
    };

    await fetch('/api/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dummyPayload),
    });
  };

  useEffect(() => {
    async function run() {
      await sendTestWebhook(); // ✅ Simulate the webhook call
      const res = await fetch('/api/webhook/logs');
      const data = await res.json();
      setWebhooks(data);
      setLoading(false);
    }
    run();
  }, []);

  return (
    <main className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">📦 Received Webhooks</h1>
      {loading ? (
        <p>Loading...</p>
      ) : webhooks.length === 0 ? (
        <p>No webhook data found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-600">
              <tr>
                <th className="text-left p-2 border">Name</th>
                <th className="text-left p-2 border">Email</th>
                <th className="text-left p-2 border">Order Value</th>
                <th className="text-left p-2 border">ROI</th>
                <th className="text-left p-2 border">Source</th>
                <th className="text-left p-2 border">Received At</th>
              </tr>
            </thead>
            <tbody>
              {webhooks.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2 border">{item.name || '-'}</td>
                  <td className="p-2 border">{item.email || '-'}</td>
                  <td className="p-2 border">{item.anticipatedOrderValue || '-'}</td>
                  <td className="p-2 border">{item.anticipatedROI || '-'}</td>
                  <td className="p-2 border">{item.receivedFrom || '-'}</td>
                  <td className="p-2 border">
                    {item.receivedAt
                      ? new Date(item.receivedAt).toLocaleString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
