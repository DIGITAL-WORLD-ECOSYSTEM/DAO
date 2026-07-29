import { z } from 'zod';

/**
 * Validator for Resend Email Campaigns
 */
export const sendCampaignSchema = z.object({
  recipient: z.string().email(),
  subject: z.string().min(1),
  bodyHtml: z.string().min(1),
});

export type SendCampaignInput = z.infer<typeof sendCampaignSchema>;
