export type UserLogin = {
    id: string;
    name: string;
    email: string
}

export type LoginUseCaseResult = {
    accessToken: string;
    refreshToken: string;
    user: UserLogin;
}

export interface LoginUseCase {
    exec(email: string, pawword: string): Promise<LoginUseCaseResult>
}