import AWS from 'aws-sdk';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
} else {
  dotenv.config({ path: '.env.production' });
}

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
