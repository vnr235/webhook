
// This file handles sending contacts from MongoDB to Salesforge.
// It retrieves contacts from a specified collection, formats them, and sends them to Salesforge's API.
// If a contact already exists in Salesforge, it logs a warning. Otherwise, it logs the success or error of the send operation.


const axios = require('axios');
const client = require('../db/mongodb');

const DB_NAME = process.env.DB_NAME ;
const COLLECTION_NAME = process.env.COLLECTION_NAME;
const SALESFORGE_API_KEY = process.env.SALESFORGE_API_KEY;
const WORKSPACE_ID = process.env.WORKSPACE_ID; // Salesforge workspace ID it won't get in URL you need to awake webhook to get it.
const SALESFORGE_CONTACT_ENDPOINT = `https://api.salesforge.ai/public/v2/workspaces/${WORKSPACE_ID}/contacts`; //Endpoint for creating contacts in salesforge

async function sendContactsToSalesforge() {
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const contacts = await db.collection(COLLECTION_NAME).find({}).toArray();

    for (const contact of contacts) {
      const [firstName, ...rest] = contact.name?.split(' ') || [''];
      const lastName = rest.join(' ');

      const payload = {
        firstName,
        lastName,
        email: contact.email || '',
        company: contact.company,
        linkedinUrl: contact.linkedin,
        customVars: { jobTitle: contact.jobtitle || '' },
        tags: ['from-mongo']
      };

      try {
        const response = await axios.post(SALESFORGE_CONTACT_ENDPOINT, payload, {
          headers: {
            Authorization: SALESFORGE_API_KEY,
            'Content-Type': 'application/json'
          }
        });
        console.log(`Sent to Salesforge: ${contact.name} (${response.status})`);
      } catch (error) {
        if (error.response?.status === 409) {
          console.warn(`Duplicate: ${contact.email}`); //Log warning for duplicate contacts.
        } else {
          console.error(`Error for ${contact.name}:`, error.response?.data || error.message); //Error handling for issues other than duplication.
        }
      }
    }

    console.log("Salesforge sync complete.");
  } catch (err) {
    console.error("Salesforge sync error:", err.message);
  }
}

module.exports = { sendContactsToSalesforge };
