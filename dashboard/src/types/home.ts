export type AnnouncementPriority = 'critical' | 'high' | 'normal' | 'low';

export interface HomeAnnouncement {
  id: string;
  priority: AnnouncementPriority;
  title: string;
  description: string;
  image?: string;
  actionLabel?: string;
  actionRoute?: string;
  startsAt: Date | string | number;
  endsAt: Date | string | number;
  published: boolean;
}

export type FeedItemType =
  | 'announcement'
  | 'event'
  | 'proposal'
  | 'project'
  | 'achievement'
  | 'partnership';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  title: string;
  content: string;
  createdAt: Date | string | number;
  authorName?: string;
  authorAvatar?: string;
  mediaUrl?: string;
  actionRoute?: string;
  actionLabel?: string;
}

export interface ActiveProject {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'planning';
}

export interface RecognitionItem {
  id: string;
  type: 'member' | 'project' | 'partner';
  name: string;
  description: string;
  avatarUrl?: string;
  badgeIcon: string;
}

export interface OpportunityItem {
  id: string;
  type: 'grant' | 'partnership' | 'sponsorship' | 'incubation';
  title: string;
  description: string;
  deadline?: Date | string | number;
}
