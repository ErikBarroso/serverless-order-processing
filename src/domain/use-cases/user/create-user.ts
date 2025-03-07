import { Customer } from '../../entities/customer';

export interface CreateUserUseCase {
    exec(data: Omit<Customer, 'id'>): Promise<Customer>;
}