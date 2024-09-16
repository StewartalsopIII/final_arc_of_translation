const Replicate = require('replicate');

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { id } = req.query;
    try {
      const prediction = await replicate.predictions.get(id);
      if (prediction.status === 'succeeded') {
        res.status(200).json({ audioUrl: prediction.output });
      } else if (prediction.status === 'failed') {
        res.status(500).json({ error: 'TTS processing failed' });
      } else {
        res.status(202).json({ status: 'processing' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to get TTS result', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};