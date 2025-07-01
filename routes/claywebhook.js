
// THis file handles sending existing leads to Clay.
// It retrieves leads from the 'webhooks' collection, checks if they have already been sent,
// and if not, sends them to Clay via a webhook. It also logs the sent leads to a 'sentLeads' collection


const express = require('express');
const router = express.Router();
const client = require('../db/mongodb');
const axios = require('axios');

const CLAY_WEBHOOK_URL = 'your_clay_webhook_url';

router.get('/send-existing-leads', async (req, res) => {
  try {
    await client.connect();
    const db = client.db();
    const leads = await db.collection('webhooks').find({}).toArray();
    const sentCollection = db.collection('sentLeads');

    for (const lead of leads) {
      const company = lead.company?.toLowerCase()?.trim();
      const buyers = Array.isArray(lead.buyersTitles) ? lead.buyersTitles.sort().join(',') : '';

      const alreadySent = await sentCollection.findOne({ company, buyers });
      if (alreadySent) continue;

      try {
        await axios.post(CLAY_WEBHOOK_URL, lead);
        await sentCollection.insertOne({ company, buyers, sentAt: new Date() });
        console.log(`Sent ${company}`);
      } catch (err) {
        console.error(`Error sending ${company}:`, err.message);
      }
    }

    res.status(200).json({ success: true, message: 'Leads sent to Clay' });
  } catch (err) {
    res.status(500).json({ error: 'Sending failed' });
  }
});

module.exports = router;
