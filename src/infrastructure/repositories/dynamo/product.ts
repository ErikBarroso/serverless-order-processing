 
import { docClient } from '../../../config/aws-config';
import { Product } from '../../../domain/entities/product';
import { ProductRepository } from '../../../domain/repositories/product';

export class DynamoProductRepository implements ProductRepository {
  private TABLE_NAME = 'Product';
    
  async create(item: Product): Promise<Product> {
    await docClient.put({ TableName: this.TABLE_NAME , Item: item }).promise();
    const result = await docClient.get({
      TableName: this.TABLE_NAME,
      Key: { id: item.id },
    }).promise();
    return result.Item as Product;
  }

  async delete(id: string): Promise<void> {
    docClient.delete({ Key: { id }, TableName: this.TABLE_NAME }).promise();
  }

  async findById(id: string): Promise<Product | null> {
    const result = await docClient.get({ Key: { id }, TableName: this.TABLE_NAME }).promise();
    return result.Item as Product;
  }

  async findAll(): Promise<Product[]> {
    const result = await docClient.scan({ TableName: this.TABLE_NAME }).promise();
    return result.Items as Product[] | [];
  }
}