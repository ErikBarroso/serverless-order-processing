import { PresentationResponse } from '../protocols/reqRes';

export const errorResponse = (error: any): PresentationResponse =>  {
  console.error('Error processing request:', error);
  return {
    statusCode: 500,
    body: {
      message: 'Ocorreu um erro ao processar a solicitação.',
      details: error?.message || error,
    },
  };
};


export const successResponse = (data: any): PresentationResponse => ({
  statusCode: 200,
  body: data,
});