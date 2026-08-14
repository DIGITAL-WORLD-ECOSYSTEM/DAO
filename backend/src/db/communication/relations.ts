import { relations } from 'drizzle-orm';
import { notifications, chatConversations, chatParticipants, chatMessages, chatReadReceipts, chatEvents } from './tables';
import { users } from '../user/tables';

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one }) => ({
  owner: one(users, { fields: [chatConversations.ownerId], references: [users.id], relationName: 'chatOwner' }),
}));

export const chatParticipantsRelations = relations(chatParticipants, ({ one }) => ({
  user: one(users, { fields: [chatParticipants.userId], references: [users.id] }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  sender: one(users, { fields: [chatMessages.senderId], references: [users.id], relationName: 'messageSender' }),
}));

export const chatReadReceiptsRelations = relations(chatReadReceipts, ({ one }) => ({
  user: one(users, { fields: [chatReadReceipts.userId], references: [users.id] }),
}));

export const chatEventsRelations = relations(chatEvents, ({ one }) => ({
  user: one(users, { fields: [chatEvents.userId], references: [users.id] }),
}));
