 
import { docClient } from '../../../config/aws-config';
import { Customer } from '../../../domain/entities/customer';
import { UserRepository } from '../../../domain/repositories/user';

export class DynamoUserRepository implements UserRepository {
  private TABLE_NAME = 'Users';
    
  async create(user: Customer): Promise<Customer> {
    await docClient.put({ TableName: this.TABLE_NAME , Item: user }).promise();
    const result = await docClient.get({
      TableName: this.TABLE_NAME,
      Key: { id: user.id },
    }).promise();
    return result.Item as Customer;
  }

  async delete(id: string): Promise<void> {
    await docClient.delete({ Key: { id }, TableName: this.TABLE_NAME }).promise();
  }

  async findByIdOrEmail(id?: string, email?: string): Promise<Customer | null> {
    const keyCondition = id ? { id } : { email };
    const result = await docClient.get({ Key: keyCondition, TableName: this.TABLE_NAME }).promise();
    return result.Item as Customer;
  }

  async findAll(): Promise<Customer[]> {
    const result = await docClient.scan({ TableName: this.TABLE_NAME }).promise();
    return result.Items as Customer[];
  }
}