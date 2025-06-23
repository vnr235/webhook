// app/utils/sendDummyWebhook.js
export async function triggerTestWebhook() {
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

  const res = await fetch('/api/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dummyPayload),
  });

  const result = await res.json();
  return result;
}
