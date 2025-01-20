require('dotenv').config();
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.ALLOWED_ORIGIN : '*'
}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));

// Serve static files
app.use(express.static('public'));

// Serve main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Input validation middleware
const validateChatInput = (req, res, next) => {
  const { messages, language } = req.body;

  if (!Array.isArray(messages) || !language || typeof language !== 'string') {
    return res.status(400).json({ error: 'Invalid input format' });
  }

  if (messages.length > 100) { // Limit conversation length
    return res.status(400).json({ error: 'Conversation too long' });
  }

  const validMessage = (msg) => {
    return msg &&
      typeof msg.role === 'string' &&
      typeof msg.content === 'string' &&
      ['user', 'assistant', 'system'].includes(msg.role) &&
      msg.content.length <= 4000; // Limit message size
  };

  if (!messages.every(validMessage)) {
    return res.status(400).json({ error: 'Invalid message format' });
  }

  next();
};

// Chat endpoint
app.post('/api/chat', validateChatInput, async (req, res) => {
  const { messages, language } = req.body;

  try {
    console.log('Received request:', { messages, language });

    const response = await fetch('https://api.groq.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content: `You are PatheticAI, a helpful and friendly AI assistant focused on providing accurate and helpful responses. Please communicate in ${language}. If you receive any harmful or inappropriate requests, respond with a polite decline.`
          },
          ...messages.slice(-20) // Only send the last 20 messages to avoid token limits
        ],
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    });

    console.log('Groq API response:', response);

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API Error:', error);
      throw new Error('Failed to get response from Groq API');
    }

    const data = await response.json();
    console.log('Parsed Groq API response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Groq API');
    }

    res.json({
      response: data.choices[0].message.content,
      usage: data.usage
    });

  } catch (error) {
    console.error('Error in /api/chat:', error);

    const errorMessage = error.response?.status === 429
      ? 'Rate limit exceeded. Please try again later.'
      : 'Failed to get response from AI';

    res.status(error.response?.status || 500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
