import { randomUUID } from 'crypto';
import { Router } from 'express';
import AWS from 'aws-sdk';
import Bcrypt from '../../infrastructure/encrypters/bcrypt';

AWS.config.update({
  region:'us-east-1',
  accessKeyId: 'fakeAccessKeyId', // Chave falsa
  secretAccessKey: 'fakeSecretAccessKey', // Chave falsa
  logger: console, 
});

const docClient = new AWS.DynamoDB.DocumentClient({
  endpoint: 'http://db:4566',
});
//refactor essa rota
const userRouter  = Router();

const bcrypt = new Bcrypt();

//creat
userRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password);  
  
    const params = {
      TableName: 'Users',
      Item: {
        id: randomUUID(),
        name,
        email,
        password: hashedPassword,  
      },
    };
  
    docClient.put(params, (err, data) => {
      if (err) {
        console.error('DynamoDB Error:', err);
        return res.status(500).json({ error: 'Erro ao adicionar usuário', details: err });
      }
      res.status(201).json({ message: 'Usuário adicionado com sucesso', data });
    });
  
  } catch (error) {
    console.error('Erro ao criar hash da senha:', error);
    res.status(500).json({ error: 'Erro ao processar a senha' });
  }
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