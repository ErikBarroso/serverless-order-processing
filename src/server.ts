import express, { Response, Request } from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000') ;

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Order API is active!');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at PORT: ${PORT}`);
});

