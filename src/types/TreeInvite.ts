export interface TreeInvite {
  id: string;
  treeId: string;
  inviterId: string;
  email: string;
  name: string;
  status: 'pending' | 'accepted' | 'expired' | 'declined';
  createdAt: string;
  expiresAt: string;
  acceptedBy?: string;
  acceptedAt?: string;
  resendCount?: number;
  lastResendAt?: string;
}