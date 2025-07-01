// const express = require('express');
// const { MongoClient } = require('mongodb');
// const axios = require('axios');

// const app = express();
// app.use(express.json());

// // --- CONFIGURATION ---
// const MONGO_URI = 'mongodb+srv://vnr235:2O4hh2m805SNRVFa@teachermeetmanager.zghsa9b.mongodb.net/';
// const CLAY_WEBHOOK_URL = 'https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-2622a786-2536-4c7a-86be-2f2748f71bf9';
// const SALESFORGE_API_KEY = 'd13c23c6fe14184ac981f5456376523c834ddc5bf765851d36d314931a1cf94f';
// const SALESFORGE_WORKSPACE_ID = 'wks_c0h7rluqcmuxaqs4d0q4a';
// const SALESFORGE_CONTACT_ENDPOINT = `https://api.salesforge.ai/public/v2/workspaces/${SALESFORGE_WORKSPACE_ID}/contacts`;
// const PORT = process.env.PORT || 3000;

// // --- MongoDB Client ---
// const client = new MongoClient(MONGO_URI);

// // --- Real-time webhook watcher ---
// async function startWebhookToClay() {
//   try {
//     await client.connect();
//     const db = client.db();
//     const collection = db.collection('webhooks');

//     const changeStream = collection.watch([{ $match: { operationType: 'insert' } }]);
//     console.log("Watching for new webhook inserts...");

//     changeStream.on('change', async ({ fullDocument: lead }) => {
//       const payload = { ...lead };

//       try {
//         const res = await axios.post(CLAY_WEBHOOK_URL, payload);
//         console.log(`Sent lead ${lead.id} to Clay: ${res.status}`);
//       } catch (err) {
//         console.error("Error sending to Clay:", err.response?.data || err.message);
//       }
//     });
//   } catch (err) {
//     console.error("MongoDB Watch Error:", err.message);
//   }
// }

// // --- Endpoint: Save enriched Clay profiles ---
// app.post('/save-clay-profiles', async (req, res) => {
//   try {
//     const db = client.db();
//     const collection = db.collection('enrichedProfiles');

//     await collection.insertOne(req.body);
//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("Error saving profile:", err.message);
//     res.status(500).json({ error: 'Failed to save profile' });
//   }
// });

// // --- Endpoint: Save enriched person with duplicate check ---
// app.post('/save-enriched-person', async (req, res) => {
//   try {
//     const { name, company, jobtitle, email, linkedin } = req.body;

//     if (!name || !company || !jobtitle) {
//       return res.status(400).json({ error: 'Missing required fields (name/company/jobtitle)' });
//     }

//     const db = client.db('forceequals');
//     const collection = db.collection('ClayData');

//     const exists = await collection.findOne({ name, company, jobtitle });
//     if (exists) {
//       console.log(`Duplicate: ${name} @ ${company}`);
//       return res.status(200).json({ success: false, message: 'Already exists' });
//     }

//     const result = await collection.insertOne({
//       name, company, jobtitle, email: email || '', linkedin: linkedin || '', createdAt: new Date()
//     });

//     console.log(`Inserted with ID: ${result.insertedId.toString()}`);
//     res.status(200).json({ success: true, id: result.insertedId });
//   } catch (err) {
//     console.error("Insert failed:", err.message);
//     res.status(500).json({ error: 'MongoDB insert failed' });
//   }
// });

// // --- Manual push: Send all leads to Clay ---
// app.get('/send-existing-leads', async (req, res) => {
//   try {
//     const db = client.db();
//     const leadsCollection = db.collection('webhooks');
//     const sentCollection = db.collection('sentLeads');

//     const leads = await leadsCollection.find({}).toArray();
//     for (const lead of leads) {
//       const company = lead.company?.toLowerCase()?.trim();
//       const buyers = Array.isArray(lead.buyersTitles) ? lead.buyersTitles.sort().join(',') : '';

//       const alreadySent = await sentCollection.findOne({ company, buyers });
//       if (alreadySent) {
//         console.log(`Already sent: ${company}`);
//         continue;
//       }

//       try {
//         const res = await axios.post(CLAY_WEBHOOK_URL, lead);
//         console.log(`Sent ${company} to Clay:`, res.status);
//         await sentCollection.insertOne({ company, buyers, sentAt: new Date() });
//       } catch (err) {
//         console.error(`Failed to send ${company}:`, err.response?.data || err.message);
//       }
//     }

//     res.status(200).json({ success: true, message: 'All existing leads sent to Clay' });
//   } catch (err) {
//     console.error("Send existing leads error:", err.message);
//     res.status(500).json({ error: 'Failed to send leads' });
//   }
// });

// // --- Sync MongoDB contacts to Salesforge ---
// async function sendContactsToSalesforge() {
//   try {
//     console.log("Connecting to MongoDB...");
//     await client.connect();
//     const db = client.db('forceequals');
//     const collection = db.collection('ClayData');

//     const contacts = await collection.find({}).toArray();
//     console.log(`Found ${contacts.length} contacts`);

//     for (const contact of contacts) {
//       const [firstName, ...rest] = contact.name?.split(' ') || [''];
//       const lastName = rest.join(' ');

//       const payload = {
//         firstName,
//         lastName,
//         email: contact.email || '',
//         company: contact.company,
//         linkedinUrl: contact.linkedin,
//         customVars: { jobTitle: contact.jobtitle || '' },
//         tags: ['from-mongo']
//       };

//       try {
//         const response = await axios.post(SALESFORGE_CONTACT_ENDPOINT, payload, {
//           headers: {
//             'Authorization': SALESFORGE_API_KEY,
//             'Content-Type': 'application/json',
//           }
//         });
//         console.log(`Sent: ${contact.name} | Status: ${response.status}`);
//       } catch (error) {
//         if (error.response?.status === 409) {
//           console.warn(`Duplicate contact: ${contact.email}`);
//         } else {
//           console.error(`Error for ${contact.name}:`, error.response?.data || error.message);
//         }
//       }
//     }

//     console.log("Salesforge sync complete.");
//   } catch (err) {
//     console.error("Salesforge sync error:", err.message);
//   } 
// }

// // --- Start Express server ---
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
//   startWebhookToClay(); // Start watching webhooks when server starts
//   sendContactsToSalesforge(); // Sync contacts to Salesforge on startup
// });




const express = require('express');
const app = express();
const { startWebhookToClay } = require('./services/clayService');
const { sendContactsToSalesforge } = require('./services/salesforge');
const clayRoutes = require('./routes/clay');
const salesforgeRoutes = require('./routes/claywebhook');

app.use(express.json());

app.use('/', clayRoutes);
app.use('/', salesforgeRoutes);

startWebhookToClay(); // Start MongoDB change stream
sendContactsToSalesforge(); // Auto-run once on startup

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
