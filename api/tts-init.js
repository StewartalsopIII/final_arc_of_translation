import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text, language } = req.body
    try {
      const prediction = await replicate.predictions.create({
        version: "684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
        input: {
          text,
          language,
          speaker: "https://replicate.delivery/pbxt/Jt79w0xsT64R1JsiJ0LQRL8UcWspg5J4RFrU6YwEKpOT1ukS/male.wav"
        },
        webhook: `${process.env.VERCEL_URL}/api/tts-webhook`,
        webhook_events_filter: ["completed"]
      })
      res.status(200).json({ id: prediction.id })
    } catch (error) {
      res.status(500).json({ error: 'TTS initialization failed', details: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}