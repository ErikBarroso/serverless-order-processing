import AWS from 'aws-sdk';

AWS.config.update({
  region:'us-east-1',
  accessKeyId: 'fakeAccessKeyId', // Chave falsa
  secretAccessKey: 'fakeSecretAccessKey', // Chave falsa
  logger: console, 
});

export const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://db:4566',
});