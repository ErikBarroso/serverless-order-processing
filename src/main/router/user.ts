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

const userRouter  = Router();

//creat
userRouter.post('/', (req,res) => {
  const { name, email, password } = req.body;
  const params = {
    TableName: 'Users',
    Item: {
      id: randomUUID(),
      name,
      email,
      password,
    },
  };
  docClient.put(params, (err, data) => {
    if (err) {
      console.error('DynamoDB Error:', err);
      return res.status(500).json({ error: 'erro ao add user', details: err });
    }
    res.status(201).json({ message: 'user adicionado com sucesso', data });
  });
});

//delet

userRouter.delete('/:id', (req,res) => {
  const id = req.params.id;
  docClient.delete({ Key: { id }, TableName: 'Users' }, (err, data) => {
    // tratamento para buscar o item no banco antes de mandar deletar
    if (err) {
      console.error('DynamoDB Error:', err);
      return res.status(500).json({ error: 'erro ao deletar user', details: err });
    }
    res.status(201).json({ message: 'user deletado com sucesso' });
  });
});

// get item
userRouter.get('/:id', (req,res) => {
  const id = req.params.id;
  docClient.get({ Key: { id }, TableName: 'Users' }, (err, data) => {
    if (err) {
      console.error('DynamoDB Error:', err);
      return res.status(500).json({ error: 'erro ao buscar user', details: err });
    }
    res.status(201).json({ data });
  });
});

// get items all
userRouter.get('/', (req,res) => {
  docClient.scan({ TableName: 'Users' }, (err, data) => {
    if (err) {
      console.error('DynamoDB Error:', err);
      return res.status(500).json({ error: 'erro buscar users', details: err });
    }
    res.status(201).json({ data });
  });
});

export default userRouter;