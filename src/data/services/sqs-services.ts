import { SQS } from 'aws-sdk';
import { Messaging } from '../../domain/protocols/messaging';
import { UpdateOrderUseCase } from '../../domain/use-cases/order/update-order';
import { Order } from '../../domain/entities/order';
import { ok } from '../utils/result';
import { sqs } from '../../config/aws-config';

export class SQSConsumerService implements Messaging {
  private sqs: SQS;

  constructor (
    public readonly queueUrl: string,
    private readonly updateOrderUseCase: UpdateOrderUseCase,
  ) {
    
    this.sqs = sqs;
  }

  async receiveMessages(): Promise<SQS.Message[]> {
    const result = await this.sqs.receiveMessage({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10, // Processar até 10 mensagens por vez
      WaitTimeSeconds: 20,     // Long polling
      VisibilityTimeout: 30,   // Tempo para processar cada mensagem
    }).promise();

    return result.Messages as SQS.Message[];
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    await this.sqs.deleteMessage({
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    }).promise();
  }

  async processMessage(message: SQS.Message): Promise<boolean> {
    if (!message.Body) {
      return false;
    }

    const order: Order = JSON.parse(message.Body);
    await this.updateOrderUseCase.exec(order);
    return true;
  }

  async processAllMessages(): Promise<{ processed: number; failed: number }> {
    let totalProcessed = 0;
    let totalFailed = 0;
    let hasMoreMessages = true;

    while (hasMoreMessages) {
      const messages = await this.receiveMessages();
      
      if (messages.length === 0) {
        hasMoreMessages = false;
        console.log('Nenhuma mensagem na fila');
        break;
      }

      for (const message of messages) {
        const success = await this.processMessage(message);
        
        if (!success && !message.ReceiptHandle) {
          totalFailed++;
          continue;
        }

        await this.deleteMessage(message.ReceiptHandle as string);
        totalProcessed++;
      }

      if (messages.length < 10) {
        hasMoreMessages = false;
      }
    }
    
    return ok('Processamento da fila concluído!', { 
      processed: totalProcessed, 
      failed: totalFailed, 
      total: totalProcessed + totalFailed,
    });
  }

  async receiveMessage(): Promise<string> {
    const messages = await this.receiveMessages();
    return messages.length > 0 ? (messages[0].Body as string) : '';
  }
}