require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, language } = req.body;
    
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
            content: `You are PatheticAI, a helpful assistant. Please respond in ${language}.`
          },
          ...messages
        ]
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0].message) {
      res.json({ response: data.choices[0].message.content });
    } else {
      throw new Error('Invalid response from GroqCloud API');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
