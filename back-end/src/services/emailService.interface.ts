export interface IEmailService {
  sendPasswordResetEmail(email: string, name: string): Promise<string>;
}
