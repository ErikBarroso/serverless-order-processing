import { QueueProcessorWorker } from '../../../infrastructure/workers/queue-processor';
import { serverResponse, errorResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';

let workerInstance: QueueProcessorWorker | null = null;

export class QueueWorkerControlController implements Controller {
  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    try {
      const { action } = request.params;

      switch (action) {
      case 'start':
        return this.startWorker();
      case 'stop':
        return this.stopWorker();
      case 'status':
        return this.getWorkerStatus();
      default:
        return errorResponse(new Error('Ação inválida. Use: start, stop ou status'));
      }
    } catch (error) {
      return errorResponse(error);
    }
  }

  private async startWorker(): Promise<PresentationResponse> {
    try {
      if (!workerInstance) {
        workerInstance = new QueueProcessorWorker();
      }

      if (workerInstance.isRunning()) {
        return serverResponse({
          message: 'Worker já está rodando',
          status: 'running',
        });
      }

      workerInstance.start(30);
      return serverResponse({
        message: 'Worker iniciado com sucesso',
        status: 'started',
        interval: '30 segundos',
      });
    } catch (error) {
      return errorResponse(error);
    }
  }

  private async stopWorker(): Promise<PresentationResponse> {
    if (!workerInstance || !workerInstance.isRunning()) {
      return serverResponse({
        message: 'Worker não está rodando',
        status: 'stopped',
      });
    }

    workerInstance.stop();
    return serverResponse({
      message: 'Worker parado com sucesso',
      status: 'stopped',
    });
  }

  private async getWorkerStatus(): Promise<PresentationResponse> {
    const isRunning = workerInstance?.isRunning() || false;
    
    return serverResponse({
      status: isRunning ? 'running' : 'stopped',
      message: `Worker está ${isRunning ? 'rodando' : 'parado'}`,
      instance: workerInstance ? 'exists' : 'not_created',
    });
  }
} 