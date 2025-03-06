import { Customer } from '../entities/customer';

export interface UserRepository {
    create(user: Customer): Promise<Customer>;
    delete(id: string): Promise<void>;
    findById(id: string): Promise<Customer | null>;
    findByEmail(email: string): Promise<Customer | null>;
    findAll(): Promise<Customer[]>
}