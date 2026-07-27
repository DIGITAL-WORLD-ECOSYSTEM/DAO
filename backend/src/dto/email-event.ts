export const EmailEventTypes = {
    RECEIVED: 'EMAIL_RECEIVED',
    QUEUED: 'EMAIL_QUEUED',
    PROCESSING: 'EMAIL_PROCESSING',
    PARSED: 'EMAIL_PARSED',
    STORED: 'EMAIL_STORED',
    SENT: 'EMAIL_SENT',
    DELIVERED: 'EMAIL_DELIVERED',
    OPENED: 'EMAIL_OPENED',
    CLICKED: 'EMAIL_CLICKED',
    BOUNCED: 'EMAIL_BOUNCED',
    COMPLAINED: 'EMAIL_COMPLAINED',
    FAILED: 'EMAIL_FAILED',
    RETRIED: 'EMAIL_RETRIED',
    DLQ: 'EMAIL_DLQ'
} as const;

export type EmailEventType = typeof EmailEventTypes[keyof typeof EmailEventTypes];

export type EventSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface EmailEventMetadata {
    error?: string;
    retryCount?: number;
    worker?: string;
    provider?: string;
    headers?: Record<string, string>;
    queue?: string;
    latency?: number;
    attachmentCount?: number;
    spamScore?: number;
}

export interface EmailEventDTO {
    messageId?: string;
    emailId?: string;
    event: EmailEventType;
    source: string; // 'worker', 'queue', 'webhook', 'api'
    provider?: string;
    severity?: EventSeverity;
    requestId?: string;
    correlationId?: string;
    queueMessageId?: string;
    traceId?: string;
    spanId?: string;
    workerVersion?: string;
    durationMs?: number;
    metadata?: EmailEventMetadata;
}
