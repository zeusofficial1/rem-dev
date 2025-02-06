import { firestore } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';

export const sendInviteEmail = async (
  email: string,
  name: string,
  inviterName: string,
  treeName: string,
  treeId: string
) => {
  try {
    // Generate a unique invite code
    const inviteCode = nanoid(10);
    
    // Store the invite in Firestore
    await setDoc(doc(firestore, 'invites', inviteCode), {
      email,
      name,
      inviterName,
      treeName,
      treeId,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    });

    // In production, you would integrate with a service like SendGrid, Mailgun, etc.
    // For now, we'll show a success message with the invite link
    const inviteLink = `${window.location.origin}/join/${inviteCode}`;
    
    toast.success('Invitation created successfully!');
    toast.success(`Invite link: ${inviteLink}`);
    
    return inviteCode;
  } catch (error) {
    console.error('Failed to create invitation:', error);
    toast.error('Failed to create invitation');
    throw error;
  }
};