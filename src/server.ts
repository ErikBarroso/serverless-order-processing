// eslint-disable-next-line @typescript-eslint/no-require-imports
require('newrelic');
import express, { Response, Request } from 'express';
import dotenv from 'dotenv';
import router from './main/router/index';
import { checkEc2InstanceStatus } from './data/services/ec2-services';
import { QueueProcessorWorker } from './infrastructure/workers/queue-processor';


dotenv.config();
const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000') ;

app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Order API is active!');
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
    console.log(`Server is running on port ${PORT}`);
    
    initializeQueueProcessingWorker();
  });
}

function initializeQueueProcessingWorker(): void {
  try {
    const workerQueueSqs = new QueueProcessorWorker();
    workerQueueSqs.start(30); // Processar a cada 30 segundos
    
    configureElegantServerTermination(workerQueueSqs);
    
  } catch (error) {
    console.error('Erro ao inicializar worker da fila:', error);
  }
}

function configureElegantServerTermination(workerQueueSqs: QueueProcessorWorker): void {
  // Listener para sinal de terminação do sistema (kill, systemd, docker stop, etc)
  process.on('SIGTERM', () => {
    stopServerGracefully('SIGTERM', workerQueueSqs);
  });
  
  // Listener para interrupção manual (Ctrl+C no terminal)
  process.on('SIGINT', () => {
    stopServerGracefully('SIGINT', workerQueueSqs);
  });
}

function stopServerGracefully(signal: string, workerFromQueueSqs: QueueProcessorWorker): void {
  console.log(`Recebido sinal ${signal}, iniciando encerramento elegante do servidor...`);
  workerFromQueueSqs.stop();
  console.log('Servidor encerrado com sucesso!');
  process.exit(0);
}

checkServerStartMode();
