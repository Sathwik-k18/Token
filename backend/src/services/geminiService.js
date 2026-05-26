import { GoogleGenerativeAI } from '@google/generative-ai';

const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const apiKey = process.env.GEMINI_API_KEY;

function getModel() {
  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY in backend/.env');
  }
  const client = new GoogleGenerativeAI(apiKey);
  return client.getGenerativeModel({ model: modelName });
}

function roughTokens(value) {
  if (!value) return 0;
  return Math.max(1, Math.ceil(String(value).length / 4));
}

export async function streamCompletion({ prompt, onToken }) {
  const model = getModel();
  const result = await model.generateContentStream(prompt);

  let content = '';
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (!text) continue;
    content += text;
    if (onToken) onToken(text);
  }

  const finalResponse = await result.response;
  const usageMetadata = finalResponse.usageMetadata || {};
  const inputTokens = usageMetadata.promptTokenCount ?? roughTokens(prompt);
  const outputTokens = usageMetadata.candidatesTokenCount ?? roughTokens(content);

  return {
    content,
    usage: {
      input_tokens: inputTokens,
      output_tokens: outputTokens
    },
    provider: {
      model: modelName,
      totalTokenCount: usageMetadata.totalTokenCount ?? inputTokens + outputTokens
    }
  };
}
