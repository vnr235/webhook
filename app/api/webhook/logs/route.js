import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await db.collection('webhooks')
      .find({})
      .sort({ receivedAt: -1 })
      .limit(50)
      .toArray();

    return Response.json(data);
  } catch (err) {
    return Response.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
