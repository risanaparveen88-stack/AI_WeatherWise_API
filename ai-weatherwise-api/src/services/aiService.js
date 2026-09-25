const axios = require('axios');

const generateText = async (prompt, purpose = null) => {
  const apiKey = 'your_groq_api_key';

  let finalPrompt = prompt;
  if (purpose && purpose.trim() !== '') {
    finalPrompt += ` The user's specific purpose today is: "${purpose}".`;
  }

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: `You are an AI weather assistant. You must output your response strictly as a valid JSON object with these exact keys:
{
  "summary": "Short weather summary sentence",
  "clothing": ["item 1", "item 2", "item 3"],
  "activities": ["item 1", "item 2", "item 3"],
  "healthTips": ["item 1", "item 2", "item 3"],
  "purposeTip": "Custom advice based on the user's purpose if provided, otherwise empty string"
}`
          },
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        response_format: { type: "json_object" }, // <-- Groq JSON mode ensures 100% valid JSON output
        temperature: 0.3,
        max_tokens: 400
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const rawContent = response.data.choices[0]?.message?.content || '{}';
    const parsedData = JSON.parse(rawContent);

    const result = {
      summary: parsedData.summary || 'Weather conditions look stable.',
      clothing: Array.isArray(parsedData.clothing) && parsedData.clothing.length ? parsedData.clothing : ['Wear light cotton clothes.'],
      activities: Array.isArray(parsedData.activities) && parsedData.activities.length ? parsedData.activities : ['Good for daytime tasks.'],
      healthTips: Array.isArray(parsedData.healthTips) && parsedData.healthTips.length ? parsedData.healthTips : ['Stay hydrated.']
    };

    if (purpose && purpose.trim() !== '') {
      result.purposeTip = parsedData.purposeTip || `For your activity (${purpose}), stay safe and follow weather advisories.`;
    }

    return { ...result, fallback: false };

  } catch (error) {
    console.error('Groq JSON Error:', error.message);
    const fallbackRes = {
      summary: 'Warm weather observed.',
      clothing: ['Wear loose cotton outfits.'],
      activities: ['Light shaded activities.'],
      healthTips: ['Drink plenty of water.']
    };
    if (purpose && purpose.trim() !== '') {
      fallbackRes.purposeTip = `For your activity (${purpose}), take standard precautions.`;
    }
    return { ...fallbackRes, fallback: true };
  }
};

module.exports = { generateText };