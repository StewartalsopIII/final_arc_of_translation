import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query
    try {
      const result = await kv.get(`tts:${id}`)
      if (result) {
        res.status(200).json({ audioUrl: result })
      } else {
        res.status(202).json({ status: 'processing' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to get TTS result', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}