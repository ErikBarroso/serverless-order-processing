import { DynamoDB, SQS } from 'aws-sdk';
import jwt, { JwtPayload } from 'jsonwebtoken';

const docClient = new DynamoDB.DocumentClient();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY!) as JwtPayload;
  } catch (error) {
    throw new Error(`Token inválido ou expirado: ${error}`);
  }
};

const verifyProductExists = async (productId: string): Promise<unknown> => {
  const result = await docClient.get({
    TableName: 'Product',
    Key: { id: productId },
  }).promise();
  
  if (!result.Item) {
    throw new Error(`Produto não encontrado: ${productId}`);
  }
  return result.Item;
};

const verifyAllProductsExist = async (productIds: string[]): Promise<unknown> => {
  const productPromises = productIds.map(id => verifyProductExists(id));
  return Promise.all(productPromises);
};

const createOrder = (userId: string, products: unknown[]): unknown => {
  return {
    id: new Date().toISOString(),
    customerId: userId.toLowerCase(),
    orderStatus: 'PENDING',
    items: products,
    createdAt: new Date().toISOString(),
  };
};

const saveOrderToDynamoDB = async (order: any): Promise<void> => {
  await docClient.put({
    TableName: 'Orders',
    Item: order,
  }).promise();
};

const sendMessageToQueue = async (order: unknown): Promise<void> => {
  const queueUrl = process.env.QUEUE_URL;
  if (!queueUrl) {
    throw new Error('URL da fila não configurada');
  }

  const sqs = new SQS({ region: 'us-east-2' });    
  await sqs.sendMessage({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(order),
  }).promise();
  console.log('Mensagem enviada para a fila:', order);
};

export const handler = async (event: any): Promise<unknown> => {
  try {
    const token = event.headers?.Authorization?.split(' ')[1];
    const decoded = verifyToken(token);
    const userId = decoded.id;
    
    const body = JSON.parse(event.body);
    const products = body.items;
    
    const productIds = products.map((product: unknown) => product);
    await verifyAllProductsExist(productIds);

    const order = createOrder(userId, products);
    await saveOrderToDynamoDB(order);
    await sendMessageToQueue(order);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Pedido criado com sucesso!',
        order,
      }),
    };
  } catch (err: any) {
    console.error('Erro:', err);
    
    if (err.message && err.message.includes('Produto não encontrado')) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Erro ao criar pedido.',
          error: err.message,
        }),
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Erro interno do servidor.',
        error: err.message,
      }),
    };
  }
};
