const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { text, language } = req.body;
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: `You are a translator. Translate the following text to ${language}.` },
          { role: "user", content: text }
        ]
      });
      res.status(200).json({ translatedText: response.data.choices[0].message.content.trim() });
    } catch (error) {
      res.status(500).json({ error: 'Translation failed', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};