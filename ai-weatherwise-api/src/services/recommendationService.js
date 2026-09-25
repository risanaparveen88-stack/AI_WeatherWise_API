const { generateText } = require('./aiService');

const getAIInsight = async (weather, contextPrompt) => {
  const prompt = `
Weather Data:
- Temperature: ${weather.temperature}°C
- Condition: ${weather.condition}
- Humidity: ${weather.humidity || 'N/A'}%
- Feels Like: ${weather.feelsLike || weather.temperature}°C
- Wind Speed: ${weather.windSpeed || 'N/A'} m/s

Instruction: ${contextPrompt}
`;

  const response = await generateText(prompt);

  const defaultHighlights = [
    `Current temperature stands at ${weather.temperature}°C.`,
    `Atmospheric condition observed: ${weather.condition}.`,
    weather.humidity ? `Humidity level is around ${weather.humidity}%.` : 'Normal atmospheric moisture.'
  ];

  return {
    summary: response.summary,
    highlights: response.highlights && response.highlights.length ? response.highlights : defaultHighlights,
    clothing: response.clothing,
    activities: response.activities,
    healthTips: response.healthTips
  };
};

module.exports = { getAIInsight };