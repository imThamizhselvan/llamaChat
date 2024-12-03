import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const PORT: number = 8000;

interface ChatRequest {
  message: string;
}

interface LlamaResponse {
  generated_text: string;
}

app.post('/chat', async (req: Request<{}, {}, ChatRequest>, res: Response) => {
  try {
    const response = await axios.post<LlamaResponse>('http://localhost:8080/generate', {
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