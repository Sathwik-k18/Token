// Placeholder for OpenAI streaming integration.
export async function streamCompletion({ prompt, onToken }) {
  const fake = `Simulated response for: ${prompt}`;
  for (const chunk of fake.split(' ')) {
    await new Promise((r) => setTimeout(r, 20));
    onToken(`${chunk} `);
  }
  return {
    content: fake,
    usage: {
      input_tokens: Math.ceil(prompt.length / 4),
      output_tokens: Math.ceil(fake.length / 4)
    }
  };
}
