import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// NVIDIA API endpoint
app.post('/api/nvidia', async (req, res) => {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'NVIDIA API key not configured' });
  }

  try {
    const { model, messages, temperature, max_tokens } = req.body;

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('NVIDIA API error:', response.status, errorData);
      return res.status(response.status).json({
        error: `NVIDIA API error: ${response.statusText}`,
        details: errorData,
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error calling NVIDIA API:', error);
    return res.status(500).json({
      error: 'Failed to call NVIDIA API',
      message: error.message,
    });
  }
});

// Anthropic API endpoint (if needed)
app.post('/api/claude', async (req, res) => {
  // Similar implementation for Claude
  res.status(501).json({ error: 'Not implemented in dev server' });
});

app.listen(PORT, () => {
  console.log(`Development API server running on http://localhost:${PORT}`);
});

