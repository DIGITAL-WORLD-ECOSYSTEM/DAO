// Domain Events DTOs
export interface AccountCreatedEvent {
  userId: number;
  email: string;
  createdAt: string;
}

export interface CitizenRegisteredEvent {
  userId: number;
  username: string;
}
