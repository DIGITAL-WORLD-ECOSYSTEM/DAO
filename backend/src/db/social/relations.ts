import { relations } from 'drizzle-orm';
import { userSocialLinks, posts, postComments, postFavorites } from './tables';
import { users } from '../user/tables';

export const userSocialLinksRelations = relations(userSocialLinks, ({ one }) => ({
  user: one(users, { fields: [userSocialLinks.userId], references: [users.id] }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id], relationName: 'postAuthor' }),
}));

export const postCommentsRelations = relations(postComments, ({ one }) => ({
  user: one(users, { fields: [postComments.userId], references: [users.id] }),
}));

export const postFavoritesRelations = relations(postFavorites, ({ one }) => ({
  user: one(users, { fields: [postFavorites.userId], references: [users.id] }),
}));
