
// This file handles sending new webhooks to Clay.
// It listens for new inserts in the 'webhooks' collection and sends the full document to Clay via a webhook.
// If an error occurs during the send, it logs the error message.


const axios = require('axios');
const client = require('../db/mongodb');

const CLAY_WEBHOOK_URL = process.env.CLAY_WEBHOOK_URL;

async function startWebhookToClay() {
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('webhooks');

    const changeStream = collection.watch([{ $match: { operationType: 'insert' } }]);

    console.log("Watching for new webhook inserts...");
    changeStream.on('change', async ({ fullDocument }) => {
      try {
        await axios.post(CLAY_WEBHOOK_URL, fullDocument);
        console.log(`Sent to Clay: ${fullDocument?.company || fullDocument?.id}`);
      } catch (err) {
        console.error("Clay webhook error:", err.response?.data || err.message);
      }
    });
  } catch (err) {
    console.error("MongoDB Watch Error:", err.message);
  }
}

module.exports = { startWebhookToClay };
