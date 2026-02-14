const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const API_KEY = process.env.GOOGLE_API_KEY;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend proxy is running' });
});

// Smart Conversion Endpoint
app.post('/api/convert/smart', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Invalid prompt provided' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const response = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Convert the following based on natural language intent: "${prompt}". Provide a result and a brief explanation in JSON format.`
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            result: { type: 'STRING' },
            explanation: { type: 'STRING' }
          },
          required: ['result', 'explanation']
        }
      }
    });

    const result = JSON.parse(response.response.text());
    res.json(result);
  } catch (error) {
    console.error('Smart conversion error:', error);
    res.status(500).json({ error: 'Failed to process conversion', details: error.message });
  }
});

// Data Format Conversion Endpoint
app.post('/api/convert/format', async (req, res) => {
  try {
    const { data, targetFormat } = req.body;

    if (!data || !targetFormat) {
      return res.status(400).json({ error: 'Missing data or targetFormat' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const response = await model.generateContent(
      `Convert the following data into ${targetFormat} format. Provide only the result code.\n\n${data}`
    );

    res.json({ result: response.response.text() });
  } catch (error) {
    console.error('Format conversion error:', error);
    res.status(500).json({ error: 'Failed to convert format', details: error.message });
  }
});

// Sales Follow-up Email Generation Endpoint
app.post('/api/generate/sales-followup', async (req, res) => {
  try {
    const { leadName, context } = req.body;

    if (!leadName || !context) {
      return res.status(400).json({ error: 'Missing leadName or context' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const response = await model.generateContent(
      `Draft a high-end sales closer email for "${leadName}" regarding "${context}".`
    );

    res.json({ result: response.response.text() });
  } catch (error) {
    console.error('Sales follow-up generation error:', error);
    res.status(500).json({ error: 'Failed to generate follow-up', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend proxy running on http://localhost:${PORT}`);
  console.log(`API Key configured: ${API_KEY ? 'Yes' : 'No'}`);
});
