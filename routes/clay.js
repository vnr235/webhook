
// This file handles saving the enriched person data to MongoDB without duplication.
// It checks if a person with the same name, company, and job title already exists before inserting a new record.
// If the record exists, it returns a message indicating that the person already exists.


const express = require('express');
const router = express.Router();
const client = require('../db/mongodb');

// Save enriched person with deduplication
router.post('/save-enriched-person', async (req, res) => {
  const { name, company, jobtitle, email = '', linkedin = '' } = req.body;

  if (!name || !company || !jobtitle) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await client.connect();
    const db = client.db('forceequals');
    const collection = db.collection('ClayData');

    const exists = await collection.findOne({ name, company, jobtitle });
    if (exists) {
      return res.status(200).json({ success: false, message: 'Already exists' });
    }

    const result = await collection.insertOne({ name, company, jobtitle, email, linkedin, createdAt: new Date() });
    res.status(200).json({ success: true, id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Insert failed' });
  }
});

module.exports = router;
