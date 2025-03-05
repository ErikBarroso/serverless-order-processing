export type UserLogin = {
    id: string;
    name: string;
    email: string
}

export type LoginUseCaseResult = {
    accessToken: string;
    user: UserLogin;
}

export interface LoginUseCase {
    exec(email: string, password: string): Promise<LoginUseCaseResult>
}