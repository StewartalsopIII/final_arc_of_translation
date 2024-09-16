const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const Replicate = require('replicate');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const openaiApiKey = process.env.OPENAI_API_KEY;
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/translate-and-speak', async (req, res) => {
  try {
    const { text, language } = req.body;

    // Step 1: Translate
    const translationResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are a translator. Translate the following text to ${language}.` },
        { role: "user", content: text }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const translatedText = translationResponse.data.choices[0].message.content.trim();

    // Step 2: Text-to-Speech
    const ttsInput = {
      text: translatedText,
      language: language,
      speaker: "https://replicate.delivery/pbxt/Jt79w0xsT64R1JsiJ0LQRL8UcWspg5J4RFrU6YwEKpOT1ukS/male.wav"
    };

    const ttsOutput = await replicate.run(
      "lucataco/xtts-v2:684bc3855b37866c0c65add2ff39c78f3dea3f4ff103a436465326e0f438d55e",
      { input: ttsInput }
    );

    if (ttsOutput && typeof ttsOutput === 'string') {
      res.json({ translatedText, audioUrl: ttsOutput });
    } else {
      throw new Error('Unexpected TTS output format');
    }
  } catch (error) {
    console.error('Translation and TTS error:', error);
    res.status(500).json({ error: 'Translation and TTS failed', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});