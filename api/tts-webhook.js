import { kv } from '@vercel/kv'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, output } = req.body
    await kv.set(`tts:${id}`, output)
    res.status(200).json({ message: 'Webhook received' })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}