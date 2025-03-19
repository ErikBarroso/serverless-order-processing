import express, { Response, Request } from 'express';
import dotenv from 'dotenv';
import router from './main/router/index';
import { checkEc2InstanceStatus } from './data/services/ec2-services';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000') ;

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('teste 2');
});

async function checkServerStartMode(): Promise<void> {
  if (process.env.NODE_ENV === 'development') {
    const isEc2Running = await checkEc2InstanceStatus();
    if (!isEc2Running) {
      return console.error('A instância EC2 não está ativa.');
    }
  
    return startAppServer();
  }

  startAppServer();
}

function startAppServer(): void {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`teste 2 ${PORT}`);
  });
}

checkServerStartMode();
