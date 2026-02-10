const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'qwen3-coder:30b';

async function generateEstimate(jobData) {
  try {
    const prompt = `You are an expert roofing estimator. Analyze the following job details and provide a detailed cost estimate in JSON format.

Job Details:
- Property Type: ${jobData.propertyType}
- Roof Size: ${jobData.roofSize} sq ft
- Roof Pitch: ${jobData.roofPitch || 'Not specified'}
- Description: ${jobData.description || 'None'}

Respond with ONLY valid JSON in this exact format:
{
  "laborHours": <number>,
  "materials": [
    {"name": "<material name>", "quantity": <number>, "unit": "<unit>", "estimatedCost": <number>}
  ],
  "totalCost": <number>,
  "timeline": "<estimated timeline>",
  "confidenceScore": <0-100>,
  "notes": "<any important notes or assumptions>"
}`;

    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.3,
        num_predict: 1000
      }
    });

    // Parse AI response
    const aiResponse = response.data.response;
    
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    const estimate = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!estimate.laborHours || !estimate.materials || !estimate.totalCost) {
      throw new Error('Invalid estimate structure from AI');
    }

    return {
      ...estimate,
      aiGenerated: true
    };
  } catch (error) {
    console.error('AI estimation error:', error);
    
    // Fallback to simple calculation
    return generateFallbackEstimate(jobData);
  }
}

function generateFallbackEstimate(jobData) {
  // Simple rule-based estimation
  const baseRate = 5.5; // $ per sq ft
  const totalCost = jobData.roofSize * baseRate;
  const laborCost = totalCost * 0.6;
  const laborHours = laborCost / 50; // $50/hour average

  return {
    laborHours: Math.ceil(laborHours),
    materials: [
      {
        name: 'Asphalt Shingles',
        quantity: Math.ceil(jobData.roofSize / 100),
        unit: 'bundle',
        estimatedCost: totalCost * 0.3
      },
      {
        name: 'Underlayment',
        quantity: jobData.roofSize,
        unit: 'sq ft',
        estimatedCost: totalCost * 0.05
      },
      {
        name: 'Misc Materials',
        quantity: 1,
        unit: 'lot',
        estimatedCost: totalCost * 0.05
      }
    ],
    totalCost: Math.ceil(totalCost),
    timeline: `${Math.ceil(laborHours / 8)} days`,
    confidenceScore: 50,
    notes: 'Fallback estimate based on industry averages. AI estimation unavailable.',
    aiGenerated: false
  };
}

module.exports = { generateEstimate };
