export interface Messaging {
    receiveMessage(): Promise<string>;
}