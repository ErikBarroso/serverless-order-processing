 
import { docClient } from '../../../config/aws-config';
import { Order } from '../../../domain/entities/order';
import { OrderRepository } from '../../../domain/repositories/order';

export class DynamoOrderRepository implements OrderRepository {
  private TABLE_NAME = 'Orders';
    
  async create(item: Order): Promise<Order> {
    await docClient.put({ TableName: this.TABLE_NAME , Item: item }).promise();
    const result = await docClient.get({
      TableName: this.TABLE_NAME,
      Key: { id: item.id, customerId: item.customerId },
    }).promise();
    return result.Item as Order;
  }

  async delete(id: string, userId: string): Promise<void> {
    await docClient.delete({ Key: { id, customerId: userId }, TableName: this.TABLE_NAME }).promise();
  }

  async findById(id: string, userId: string): Promise<Order | null> {
    const result = await docClient.get({ Key: { id, customerId: userId }, TableName: this.TABLE_NAME }).promise();
    return result.Item as Order;
  }

  async findAll(userId: string): Promise<Order[]> {
    const params = {
      TableName: this.TABLE_NAME,
      IndexName: 'customerId-index', 
      KeyConditionExpression: 'customerId = :customerId',
      ExpressionAttributeValues: {
        ':customerId': userId,
      },
    };
    const result = await docClient.query(params).promise();
    return result.Items as Order[];
  }
}