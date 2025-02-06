import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getInvite, acceptInvite } from '../services/inviteService';
import { TreeInvite } from '../types/TreeInvite';
import { GitBranch, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const JoinTreePage: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<TreeInvite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInvite = async () => {
      if (!inviteId) return;

      try {
        const inviteData = await getInvite(inviteId);
        setInvite(inviteData);
      } catch (error) {
        setError('This invite link is invalid or has expired.');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvite();
  }, [inviteId]);

  const handleJoin = async () => {
    if (!user || !invite) return;

    setIsJoining(true);
    try {
      const treeId = await acceptInvite(invite.id, user.uid);
      toast.success('Successfully joined the family tree!');
      navigate(`/tree/${treeId}`);
    } catch (error) {
      console.error('Error joining tree:', error);
      toast.error('Failed to join the family tree. Please try again.');
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c15329]"></div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Invite</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(invite.expiresAt) < new Date();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#c15329]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <GitBranch className="w-8 h-8 text-[#c15329]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Family Tree</h2>
          <p className="text-gray-600">
            You've been invited to join a family tree
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600">
            <p className="mb-2">
              <strong>Invited by:</strong> {invite.name}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {invite.email}
            </p>
            <p>
              <strong>Expires:</strong>{' '}
              {new Date(invite.expiresAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isExpired ? (
          <div className="text-center">
            <p className="text-red-600 mb-4">This invite has expired.</p>
            <button
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Home
            </button>
          </div>
        ) : (
          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full flex items-center justify-center px-4 py-2 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors disabled:opacity-50"
          >
            {isJoining ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Family Tree'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinTreePage;