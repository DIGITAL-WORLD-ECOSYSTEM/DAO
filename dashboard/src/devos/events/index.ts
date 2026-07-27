// events/index.ts
// Stub para o Event Bus Interno do DevOS

export type DevEvent = {
  type: string;
  payload: any;
  timestamp: Date;
  user: string;
};

export const EventTypes = {
  FEATURE_FLAG_CHANGED: 'FEATURE_FLAG_CHANGED',
  USER_IMPERSONATED: 'USER_IMPERSONATED',
  QUERY_EXECUTED: 'QUERY_EXECUTED',
  SESSION_REVOKED: 'SESSION_REVOKED',
} as const;

export class DevEventBus {
  private static events: DevEvent[] = [];

  static emit(type: string, payload: any, user: string) {
    this.events.push({
      type,
      payload,
      timestamp: new Date(),
      user,
    });
    console.log(`[DevOS Event] ${type}`, payload);
  }

  static getHistory() {
    return this.events;
  }
}
