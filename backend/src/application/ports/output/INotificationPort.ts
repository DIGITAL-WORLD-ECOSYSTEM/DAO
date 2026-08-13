export interface INotificationPort {
  sendPasswordRecovery(to: string, resetToken: string): Promise<void>;
  sendVerificationCode(to: string, code: string): Promise<void>;
}
