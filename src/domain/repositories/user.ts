import { Customer } from '../entities/customer';

export interface UserRepository {
    create(user: Customer): Promise<Customer>;
    delete(id: string): Promise<void>;
    findByIdOrEmail(id?: string, email?: string): Promise<Customer | null>;
    findAll(): Promise<Customer[]>
}