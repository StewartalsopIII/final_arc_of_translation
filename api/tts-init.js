const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { text, language } = req.body;
    try {
      const prediction = await replicate.predictions.create({
        version: "684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
        input: {
          text: text,
          language: language,
          speaker: "https://replicate.delivery/pbxt/Jt79w0xsT64R1JsiJ0LQRL8UcWspg5J4RFrU6YwEKpOT1ukS/male.wav"
        }
      });
      res.status(200).json({ id: prediction.id });
    } catch (error) {
      res.status(500).json({ error: 'TTS initialization failed', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};