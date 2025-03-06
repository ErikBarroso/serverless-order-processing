export interface AuthorizatorUseCase {
    isAuthorized: (accessToken: string) => Promise<string | null>
}