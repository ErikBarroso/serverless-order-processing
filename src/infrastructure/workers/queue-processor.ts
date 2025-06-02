import { SQSConsumerService } from '../../data/services/sqs-services';
import { UpdateOrderUseCaseImpl } from '../../data/use-cases/order/update-orders';
import { DynamoOrderRepository } from '../repositories/dynamo/order';

export class QueueProcessorWorker {
  private sqsConsumerService: SQSConsumerService;
  private intervalId: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor() {
    const queueUrl = process.env.QUEUE_URL || '';
    if (!queueUrl) {
      throw new Error('QUEUE_URL não configurada nas variáveis de ambiente');
    }

    const orderRepo = new DynamoOrderRepository();
    const updateOrderUseCase = new UpdateOrderUseCaseImpl(orderRepo);
    this.sqsConsumerService = new SQSConsumerService(queueUrl, updateOrderUseCase);
  }

  async processQueue(): Promise<void> {
    if (this.isProcessing) {
      console.log('⏳ Processamento já em andamento, aguardando...');
      return;
    }

    this.isProcessing = true;
    try {
      const result = await this.sqsConsumerService.processAllMessages();
      
      if (result.processed > 0 || result.failed > 0) {
        console.log(`Worker - Processadas: ${result.processed}, Falharam: ${result.failed}`);
      }
    } catch (error) {
      console.error('Erro no worker de processamento:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  start(intervalSeconds = 30): void {
    if (this.intervalId) {
      console.log('Worker já está rodando');
      return;
    }

    console.log(`Iniciando worker de processamento da fila (intervalo: ${intervalSeconds}s)`);
    
    // Processar imediatamente
    this.processQueue();
    
    // Depois processar em intervalos
    this.intervalId = setInterval(() => {
      this.processQueue();
    }, intervalSeconds * 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Worker de processamento parado');
    }
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }
} 