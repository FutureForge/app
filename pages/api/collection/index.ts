import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../utils/lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise
    const db = client.db('CROSS-FI')

    if (req.method === 'GET') {
      const collections = await db.collection('collections').find({}).toArray()
      res.status(200).json({ success: true, data: collections })
    } else if (req.method === 'POST') {
      const { collectionContractAddress, name, description, backgroundImage, image } = req.body

      const newCollection = {
        collectionContractAddress,
        name,
        description,
        image,
        backgroundImage,
        createdAt: new Date(),
      }

      const result = await db.collection('collections').insertOne(newCollection)
      res.status(201).json({ success: true, data: result })
    } else {
      res.status(405).json({ success: false, message: 'Method not allowed' })
    }
  } catch (error: any) {
    console.error('API Error:', error)
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' })
  }
}
