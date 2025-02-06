import React, { useState, useEffect } from 'react';
import { Mail, Check, X, UserPlus, Clock, RefreshCw, Search, Filter, Users } from 'lucide-react';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import { useAuth } from '../contexts/AuthContext';
import { createInvite, resendInvite } from '../services/inviteService';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface InvitedMember {
  id: string;
  email: string;
  name: string;
  status: 'pending' | 'accepted' | 'declined';
  invitedAt: string;
}

const InviteFamilyPage: React.FC = () => {
  const [invitedMembers, setInvitedMembers] = useState<InvitedMember[]>([]);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [newInviteName, setNewInviteName] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all');
  const { currentTree } = useFamilyTree();
  const { user } = useAuth();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newInviteEmail.trim() || !newInviteName.trim()) {
      toast.error('Please fill in both name and email fields');
      return;
    }

    if (!currentTree) {
      toast.error('Please select a family tree first');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to send invites');
      return;
    }

    setIsInviting(true);
    try {
      const inviteId = await createInvite(
        currentTree.id,
        user.uid,
        user.displayName || 'Family Member',
        currentTree.name,
        newInviteEmail.trim(),
        newInviteName.trim()
      );

      const newMember: InvitedMember = {
        id: inviteId,
        email: newInviteEmail.trim(),
        name: newInviteName.trim(),
        status: 'pending',
        invitedAt: new Date().toISOString(),
      };

      setInvitedMembers(prev => [newMember, ...prev]);
      setNewInviteEmail('');
      setNewInviteName('');
      toast.success('Invitation sent successfully!');
    } catch (error) {
      console.error('Failed to send invitation:', error);
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleResend = async (inviteId: string) => {
    try {
      await resendInvite(inviteId);
      toast.success('Invitation resent successfully!');
    } catch (error) {
      console.error('Failed to resend invitation:', error);
      toast.error('Failed to resend invitation');
    }
  };

  const filteredMembers = invitedMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!currentTree) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Family Tree Selected</h2>
          <p className="text-gray-500">Please select a family tree before sending invites.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#c15329] to-[#ff853f] rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Invite Family Members
            </h1>
            <p className="text-white/80">
              Grow your family tree by inviting relatives to join
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {/* Invite Form */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <UserPlus className="w-6 h-6 mr-2 text-[#c15329]" />
            Send New Invitation
          </h2>
          <form onSubmit={handleInvite} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient's Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newInviteName}
                  onChange={(e) => setNewInviteName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
                  placeholder="Enter their name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={newInviteEmail}
                  onChange={(e) => setNewInviteEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
                  placeholder="Enter their email"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isInviting}
                className="inline-flex items-center px-6 py-3 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors disabled:opacity-50"
              >
                {isInviting ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Send Invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Invitations List */}
        <div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">Sent Invitations</h2>
              <p className="text-sm text-gray-500">
                Track and manage your sent invitations
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <input
                  type="text"
                  placeholder="Search invites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {filteredMembers.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <Mail className="w-6 h-6 text-[#c15329]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1.5" />
                          Sent {new Date(member.invitedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className={`flex items-center ${
                        member.status === 'accepted' ? 'text-green-600' :
                        member.status === 'declined' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {member.status === 'accepted' ? <Check className="w-5 h-5" /> :
                         member.status === 'declined' ? <X className="w-5 h-5" /> :
                         <Clock className="w-5 h-5" />}
                        <span className="ml-2 font-medium capitalize">
                          {member.status}
                        </span>
                      </div>
                      {member.status === 'pending' && (
                        <button
                          onClick={() => handleResend(member.id)}
                          className="p-2 text-[#c15329] hover:bg-[#c15329]/10 rounded-lg transition-colors"
                          title="Resend invitation"
                        >
                          <RefreshCw className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No invitations found</h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start inviting family members to join your tree'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteFamilyPage;