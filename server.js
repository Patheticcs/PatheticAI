require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch'); // Ensure fetch is available

const app = express();

// Security Middleware
app.use(helmet());

// CORS Middleware
app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGIN : '*',
  })
);

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body Parsing Middleware
app.use(express.json({ limit: '1mb' }));

// Serve Static Files
app.use(express.static('public'));

// Serve Main HTML File
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Input Validation Middleware
const validateChatInput = (req, res, next) => {
  const { messages, language } = req.body;

  if (!Array.isArray(messages) || !language || typeof language !== 'string') {
    return res.status(400).json({ error: 'Invalid input format' });
  }

  if (messages.length > 100) {
    return res.status(400).json({ error: 'Conversation too long' });
  }

  const validMessage = (msg) =>
    msg &&
    typeof msg.role === 'string' &&
    typeof msg.content === 'string' &&
    ['user', 'assistant', 'system'].includes(msg.role) &&
    msg.content.length <= 4000;

  if (!messages.every(validMessage)) {
    return res.status(400).json({ error: 'Invalid message format' });
  }

  next();
};

// Chat Endpoint
app.post('/api/chat', validateChatInput, async (req, res) => {
  const { messages, language } = req.body;

  try {
    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: `You are PatheticAI, a helpful and friendly AI assistant focused on providing accurate and helpful responses. Please communicate in ${language}. If you receive any harmful or inappropriate requests, respond with a polite decline.`,
          },
          ...messages.slice(-20), // Send the last 20 messages only
        ],
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API Error:', error);
      throw new Error('Failed to get response from Groq API');
    }

    const data = await response.json();

    res.json({
      response: data.choices[0]?.message?.content || 'No response generated.',
      usage: data.usage,
    });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: 'Failed to get response from AI',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
