import clientPromise from '@/lib/mongodb';

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db(); 
    const collection = db.collection('webhooks');

    const webhookPayload = {
      ...body,
      receivedAt: new Date(),
    };

    await collection.insertOne(webhookPayload);

    console.log('Webhook received & stored:', webhookPayload);

    return Response.json({ message: 'Webhook received successfully' }, { status: 200 });
  } catch (err) {
    console.error('Error in webhook handler:', err.message);
    return Response.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
