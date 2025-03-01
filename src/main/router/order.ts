import { randomUUID } from 'crypto';
import { Router } from 'express';
import AWS from 'aws-sdk';

AWS.config.update({
  region:'us-east-1',
  accessKeyId: 'fakeAccessKeyId', // Chave falsa
  secretAccessKey: 'fakeSecretAccessKey', // Chave falsa
  logger: console, 
});

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://db:4566',
});

const orderRouter  = Router();

//creat
orderRouter.post('/', (req,res) => {
  const { customerId, items } = req.body;
  const params = {
    TableName: 'Orders',
    Item: {
      id: randomUUID(),
      customerId, // pegar do token
      orderStatus: 'PENDING' ,
      items,
      createdAt: new Date().toISOString(),
    },
  };
  docClient.put(params, (err, data) => {
    if (err) {
      console.error('DynamoDB Error:', err);
      return res.status(500).json({ error: 'erro ao criar order', details: err });
    }
    res.status(201).json({ message: 'Order criada com sucesso', data });
  });
});

//delet

orderRouter.delete('/:id', (req,res) => {
  const id = req.params.id;
  docClient.delete({ Key: { id }, TableName: 'Orders' }, (err, data) => {
    // tratamento para buscar o item no banco antes de mandar deletar
    if (err) {
      console.error('DynamoDB Error:', err);
      return res.status(500).json({ error: 'erro ao deletar Order', details: err });
    }
    res.status(201).json({ message: 'Order deletada com sucesso' });
  });
});

// get item
orderRouter.get('/:id', (req,res) => {
  const id = req.params.id;
  docClient.get({ Key: { id }, TableName: 'Orders' }, (err, data) => {
    if (err) {
      console.error('DynamoDB Error:', err);
      return res.status(500).json({ error: 'erro ao buscar order', details: err });
    }
    res.status(201).json({ data });
  });
});

// get items all
orderRouter.get('/', (req,res) => {
  docClient.scan({ TableName: 'Orders' }, (err, data) => {
    if (err) {
      console.error('DynamoDB Error:', err);
      return res.status(500).json({ error: 'erro buscar orders', details: err });
    }
    res.status(201).json({ data });
  });
});

export default orderRouter;