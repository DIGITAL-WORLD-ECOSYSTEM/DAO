export interface QueueEnvelope<T = unknown> {
  id: string; // Message UUID
  version: number; // e.g. 1
  type: 'outbound' | 'inbound-large' | 'retry' | 'webhook' | 'notification';
  payload: T;
  correlationId: string;
  createdAt: number; // Timestamp
}

export interface OutboundEmailQueueDTO {
  emailId: string;
}

export interface InboundLargeEmailQueueDTO {
  r2Key: string;
  from: string;
  to: string[];
  authMetadata?: Record<string, any>;
}
