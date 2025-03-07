import { Customer } from '../../entities/customer';

export interface FindUsersUseCase {
    exec(): Promise<Customer[]>;
}