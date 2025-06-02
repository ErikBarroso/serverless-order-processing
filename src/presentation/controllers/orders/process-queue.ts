import { SQSConsumerService } from '../../../data/services/sqs-services';
import { serverResponse, errorResponse } from '../../helpers/response-builder';
import { Controller } from '../../protocols/controller';
import { PresentationRequest, PresentationResponse } from '../../protocols/reqRes';

export class ProcessQueueController implements Controller {
  constructor(private readonly sqsConsumerService: SQSConsumerService) {}
    
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handle(request: PresentationRequest): Promise<PresentationResponse> {
    try {
      const result = await this.sqsConsumerService.processAllMessages();
      return serverResponse(result);
    } catch (error) {
      return errorResponse(error);
    }
  }
} 