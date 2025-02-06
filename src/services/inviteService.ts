import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/config';
import { nanoid } from 'nanoid';
import { TreeInvite } from '../types/TreeInvite';
import toast from 'react-hot-toast';
import { getAuth } from 'firebase/auth';

export const createInvite = async (
  treeId: string, 
  inviterId: string, 
  inviterName: string,
  treeName: string,
  email: string, 
  name: string
) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    toast.error('You must be logged in to send invites');
    throw new Error('Not authenticated');
  }

  try {
    // First check if user has permission to invite for this tree
    const treeRef = doc(firestore, 'trees', treeId);
    const treeDoc = await getDoc(treeRef);
    
    if (!treeDoc.exists()) {
      toast.error('Tree not found');
      throw new Error('Tree not found');
    }

    const treeData = treeDoc.data();
    if (treeData.ownerId !== currentUser.uid && !treeData.admins?.includes(currentUser.uid)) {
      toast.error('You do not have permission to send invites for this tree');
      throw new Error('Permission denied');
    }

    const inviteId = nanoid(10);
    const inviteRef = doc(firestore, 'invites', inviteId);
    
    const invite: TreeInvite = {
      id: inviteId,
      treeId,
      inviterId: currentUser.uid,
      inviterName,
      treeName,
      email,
      name,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Generate invite link
    const inviteLink = `${window.location.origin}/join/${inviteId}`;

    // Store the invite in Firestore
    await setDoc(inviteRef, {
      ...invite,
      inviteLink,
    });

    // Trigger the Cloud Function to send email
    try {
      const sendEmailEndpoint = `https://us-central1-${process.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/sendInviteEmail`;
      await fetch(sendEmailEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await currentUser.getIdToken()}`,
        },
        body: JSON.stringify({
          to: email,
          recipientName: name,
          inviterName,
          treeName,
          inviteLink,
        }),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.warning('Invite created but email notification failed to send');
    }

    toast.success('Invitation sent successfully!');
    return inviteId;
  } catch (error) {
    console.error('Error creating invite:', error);
    throw error;
  }
};

export const getInvite = async (inviteId: string): Promise<TreeInvite> => {
  const inviteRef = doc(firestore, 'invites', inviteId);
  const inviteDoc = await getDoc(inviteRef);

  if (!inviteDoc.exists()) {
    throw new Error('Invite not found');
  }

  return { id: inviteDoc.id, ...inviteDoc.data() } as TreeInvite;
};

export const resendInvite = async (inviteId: string): Promise<void> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    toast.error('You must be logged in to resend invites');
    throw new Error('Not authenticated');
  }

  try {
    const inviteRef = doc(firestore, 'invites', inviteId);
    const inviteDoc = await getDoc(inviteRef);

    if (!inviteDoc.exists()) {
      toast.error('Invite not found');
      throw new Error('Invite not found');
    }

    const invite = inviteDoc.data() as TreeInvite;

    // Check permissions
    const treeRef = doc(firestore, 'trees', invite.treeId);
    const treeDoc = await getDoc(treeRef);
    
    if (!treeDoc.exists()) {
      toast.error('Tree not found');
      throw new Error('Tree not found');
    }

    const treeData = treeDoc.data();
    if (treeData.ownerId !== currentUser.uid && !treeData.admins?.includes(currentUser.uid)) {
      toast.error('You do not have permission to resend invites for this tree');
      throw new Error('Permission denied');
    }

    // Update invite with new expiration and resend count
    const updates = {
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      resendCount: (invite.resendCount || 0) + 1,
      lastResendAt: new Date().toISOString(),
    };

    await updateDoc(inviteRef, updates);

    // Resend email
    const inviteLink = `${window.location.origin}/join/${inviteId}`;
    const sendEmailEndpoint = `https://us-central1-${process.env.VITE_FIREBASE_PROJECT_ID}.cloudfunctions.net/sendInviteEmail`;
    
    await fetch(sendEmailEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await currentUser.getIdToken()}`,
      },
      body: JSON.stringify({
        to: invite.email,
        recipientName: invite.name,
        inviterName: invite.inviterName,
        treeName: invite.treeName,
        inviteLink,
        isResend: true,
      }),
    });

    toast.success('Invitation resent successfully!');
  } catch (error) {
    console.error('Error resending invite:', error);
    throw error;
  }
};

export const acceptInvite = async (inviteId: string, userId: string): Promise<string> => {
  const auth = getAuth();
  const currentUser = auth.currentUser;

  if (!currentUser) {
    toast.error('You must be logged in to accept invites');
    throw new Error('Not authenticated');
  }

  try {
    const inviteRef = doc(firestore, 'invites', inviteId);
    const inviteDoc = await getDoc(inviteRef);

    if (!inviteDoc.exists()) {
      toast.error('Invite not found');
      throw new Error('Invite not found');
    }

    const invite = inviteDoc.data() as TreeInvite;

    // Check if invite is expired
    if (new Date(invite.expiresAt) < new Date()) {
      toast.error('This invite has expired');
      throw new Error('Invite expired');
    }

    // Update invite status
    await updateDoc(inviteRef, {
      status: 'accepted',
      acceptedBy: userId,
      acceptedAt: new Date().toISOString(),
    });

    // Add user to tree members
    const treeRef = doc(firestore, 'trees', invite.treeId);
    await updateDoc(treeRef, {
      [`members.${userId}`]: true,
    });

    toast.success('Successfully joined the family tree!');
    return invite.treeId;
  } catch (error) {
    console.error('Error accepting invite:', error);
    throw error;
  }
};