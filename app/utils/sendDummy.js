// app/utils/sendDummyWebhook.js
export async function triggerTestWebhook() {
  const dummyData = [
  {
    id: "12345",
    name: "Acme Inc.",
    website: "https://acme.com",
    offeredshare: "20% Equity",
    whyTarget: "Expanding to US market",
    whyNow: "Q3 launch window",
    solution: "AI-powered analytics",
    problems: "Manual reporting delays",
    primaryCompetitors: "BetaCorp, Delta Analytics",
    buyersTitles: "CMO, VP of Sales",
    email: "contact@acme.com",
    anticipatedOrderValue: 50000,
    averageCommissionRate: "8%",
    anticipatedCommission: 4000,
    anticipatedROI: "6x in 12 months"
  },
  {
    id: "67890",
    name: "Nimbus Tech",
    website: "https://nimbus.io",
    offeredshare: "15% Equity",
    whyTarget: "Looking for European expansion partners",
    whyNow: "New funding round closing soon",
    solution: "Cloud-native SaaS optimization",
    problems: "High infrastructure costs",
    primaryCompetitors: "SkySoft, NebulaWare",
    buyersTitles: "CTO, Head of Engineering",
    email: "hello@nimbus.io",
    anticipatedOrderValue: 75000,
    averageCommissionRate: "10%",
    anticipatedCommission: 7500,
    anticipatedROI: "5x in 18 months"
  },
  {
    id: "54321",
    name: "GreenVolt Energy",
    website: "https://greenvolt.energy",
    offeredshare: "10% Equity",
    whyTarget: "Sustainability-driven investors",
    whyNow: "Regulatory support for green tech",
    solution: "Next-gen solar panels",
    problems: "Low adoption rates in rural areas",
    primaryCompetitors: "EcoSolar, Voltix",
    buyersTitles: "COO, Sustainability Manager",
    email: "partners@greenvolt.energy",
    anticipatedOrderValue: 60000,
    averageCommissionRate: "7%",
    anticipatedCommission: 4200,
    anticipatedROI: "4x in 2 years"
  },
  {
    id: "98765",
    name: "MedSync Health",
    website: "https://medsync.health",
    offeredshare: "25% Equity",
    whyTarget: "Healthcare innovation funds",
    whyNow: "Upcoming clinical trial milestone",
    solution: "AI-assisted patient monitoring",
    problems: "Manual reporting by medical staff",
    primaryCompetitors: "CareLink AI, MediTrack",
    buyersTitles: "CIO, Director of Operations",
    email: "invest@medsync.health",
    anticipatedOrderValue: 85000,
    averageCommissionRate: "12%",
    anticipatedCommission: 10200,
    anticipatedROI: "7x in 3 years"
  }
];

  const res = await fetch('/api/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dummyPayload),
  });

  const result = await res.json();
  return result;
}
