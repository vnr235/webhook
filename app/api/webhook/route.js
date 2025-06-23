import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // or db('your-db-name') if needed
    const collection = db.collection('webhooks');

    const webhookPayload = {
      ...req.body,
      receivedAt: new Date()
    };

    await collection.insertOne(webhookPayload);

    console.log('Webhook stored:', webhookPayload);

    res.status(200).json({ message: 'Webhook stored successfully' });
  } catch (error) {
    console.error('Error storing webhook:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
