import { PresentationRequest, PresentationResponse } from './reqRes';

export interface Controller<T = PresentationRequest> {
  handle: (request: T) => Promise<PresentationResponse>
}
