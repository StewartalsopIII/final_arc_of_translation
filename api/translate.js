import { OpenAIApi, Configuration } from 'openai-edge'
import { OpenAIStream, StreamingTextResponse } from 'ai'

export const config = {
  runtime: 'edge',
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function handler(req) {
  if (req.method === 'POST') {
    const { text, language } = await req.json()
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: `You are a translator. Translate the following text to ${language}.` },
        { role: 'user', content: text }
      ],
      stream: true,
    })
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  }
  return new Response('Method Not Allowed', { status: 405 })
}