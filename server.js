const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8000;

// This is the endpoint that will communicate with your local LLaMA instance
app.post('/chat', async (req, res) => {
  try {
    // Modify this according to your local LLaMA API endpoint
    const response = await axios.post('http://localhost:8080/generate', {
      prompt: req.body.message,
      max_tokens: 150,
      temperature: 0.7
    });

    res.json({ response: response.data.generated_text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 