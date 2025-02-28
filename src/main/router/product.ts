import { randomUUID } from "crypto";
import { Router } from "express";
import AWS from 'aws-sdk';

AWS.config.update({
    region:'us-east-1',
    accessKeyId: 'fakeAccessKeyId', // Chave falsa
    secretAccessKey: 'fakeSecretAccessKey', // Chave falsa
    logger: console, 
})

const docClient = new AWS.DynamoDB.DocumentClient({
    endpoint: 'http://db:4566',
});

const productRouter  = Router();

//creat
productRouter.post('/', (req,res) => {
    const { name, price, stock} = req.body
    const params = {
        TableName: 'Product',
        Item: {
            id: randomUUID(),
            name,
            price,
            stock
        }
    }
    docClient.put(params, (err, data) => {
        if(err) {
            console.error('DynamoDB Error:', err);
            return res.status(500).json({error: "erro ao add produto", details: err})
        }
        res.status(201).json({ message: "Produto adicionado com sucesso", data})
    })
});

//delet

productRouter.delete('/:id', (req,res) => {
    const id = req.params.id
    docClient.delete({Key: {id}, TableName: 'Product'}, (err, data) => {
        // tratamento para buscar o item no banco antes de mandar deletar
        if(err) {
            console.error('DynamoDB Error:', err);
            return res.status(500).json({error: "erro ao deletar produto", details: err})
        }
        res.status(201).json({ message: "Produto deletado com sucesso"})
    })
})

// get item
productRouter.get('/:id', (req,res) => {
    const id = req.params.id
    docClient.get({Key: {id}, TableName: 'Product'}, (err, data) => {
        if(err) {
            console.error('DynamoDB Error:', err);
            return res.status(500).json({error: "erro ao buscar produto", details: err})
        }
        res.status(201).json({ data })
    })
})

// get items all
productRouter.get('/', (req,res) => {
    docClient.scan({TableName: 'Product'}, (err, data) => {
        if(err) {
            console.error('DynamoDB Error:', err);
            return res.status(500).json({error: "erro buscar produtos", details: err})
        }
        res.status(201).json({ data })
    })
})

export default productRouter;