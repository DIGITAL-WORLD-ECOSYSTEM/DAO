export interface KycReviewRequest {
  userId: number;
  status: 'approved' | 'rejected' | 'pending';
  reason?: string;
}
