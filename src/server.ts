import express, { Response, Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Order API is active!');
});

app.listen(PORT, () => {
  console.log(`Server running at PORT: ${PORT}`);
});

