import express, { Response, Request } from 'express';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';

AWS.config.update({
    region:'us-east-1',
})

const dynamoDB = new AWS.DynamoDB({
    endpoint: 'http://localhost:4566',
});

const docClient = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://localhost:4566',
});

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

