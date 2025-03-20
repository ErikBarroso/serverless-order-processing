import AWS from 'aws-sdk';
import dotenv from 'dotenv';

const envPath = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envPath });

AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  logger: process.env.NODE_ENV === 'development' ? console : undefined, 
});

export const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: process.env.DYNAMODB_ENDPOINT,
});

export const ec2 = new AWS.EC2({
  endpoint: process.env.EC2_ENDPOINT,
  region: process.env.AWS_REGION || 'us-east-1',
});
