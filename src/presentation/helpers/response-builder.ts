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


export const serverResponse = (data: any): PresentationResponse => ({
  statusCode: data.code ?? 200,
  body: data,
});