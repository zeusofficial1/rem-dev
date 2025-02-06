import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import { usePermissions } from '../contexts/PermissionContext';
import { 
  Shield, Users, GitBranch, Calendar, MapPin, Trash, 
  Settings, ChevronRight, User, Mail, Phone, Heart,
  Clock, Image as ImageIcon, Filter, Search, Plus
} from 'lucide-react';
import { motion } from 'framer-motion';
import AdminInfoModal from '../components/modals/AdminInfoModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import AdminBadge from '../components/AdminBadge';
import PermissionToggle from '../components/PermissionToggle';

const TreeDetailsPage: React.FC = () => {
  const { treeId } = useParams<{ treeId: string }>();
  const navigate = useNavigate();
  const { currentTree, setCurrentTree, deleteTree } = useFamilyTree();
  const { checkTreeAccess, updateMemberPermission } = usePermissions();
  const [showAdminInfoModal, setShowAdminInfoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'settings'>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [memberFilter, setMemberFilter] = useState<'all' | 'admins' | 'members'>('all');

  useEffect(() => {
    const loadTree = async () => {
      if (treeId) {
        setIsLoading(true);
        try {
          await setCurrentTree(treeId);
        } catch (error) {
          console.error('Failed to load tree:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadTree();
  }, [treeId, setCurrentTree]);

  const handleDeleteTree = async () => {
    if (!currentTree) return;
    try {
      await deleteTree(currentTree.id);
      navigate('/family-trees');
    } catch (error) {
      console.error('Failed to delete tree:', error);
    }
  };

  const handleUpdatePermission = async (memberId: string, level: 'admin' | 'member') => {
    if (!currentTree) return;
    try {
      await updateMemberPermission(currentTree.id, memberId, level);
    } catch (error) {
      console.error('Failed to update permission:', error);
    }
  };

  const filteredMembers = currentTree?.members.filter(member => {
    const matchesSearch = `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = memberFilter === 'all' || 
      (memberFilter === 'admins' && member.isAdmin) || 
      (memberFilter === 'members' && !member.isAdmin);
    return matchesSearch && matchesFilter;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c15329]"></div>
      </div>
    );
  }

  if (!currentTree) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Family Tree Not Found</h2>
          <p className="mt-2 text-gray-500">The tree you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const access = checkTreeAccess(currentTree.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#c15329] to-[#ff853f] rounded-2xl p-8 mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center">
              <GitBranch className="w-8 h-8 mr-3" />
              {currentTree.name}
            </h1>
            <p className="text-white/80">
              Created {new Date(currentTree.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to={`/tree/${currentTree.id}`}
              className="inline-flex items-center px-4 py-2 bg-white text-[#c15329] rounded-lg hover:bg-white/90 transition-colors"
            >
              <GitBranch className="w-5 h-5 mr-2" />
              View Tree
            </Link>
            {access.canEdit && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Delete tree"
              >
                <Trash className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center text-white">
              <Users className="w-5 h-5 mr-3" />
              <span className="text-lg font-medium">{currentTree.members?.length || 0} members</span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center text-white">
              <MapPin className="w-5 h-5 mr-3" />
              <span className="text-lg font-medium">
                {new Set(currentTree.members?.map(m => m.livingIn).filter(Boolean)).size} locations
              </span>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center text-white">
              <Calendar className="w-5 h-5 mr-3" />
              <span className="text-lg font-medium">
                Last updated {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'overview'
                  ? 'border-[#c15329] text-[#c15329]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'members'
                  ? 'border-[#c15329] text-[#c15329]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Members
            </button>
            {access.canEdit && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === 'settings'
                    ? 'border-[#c15329] text-[#c15329]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Settings
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Tree Statistics */}
              <section>
                <h2 className="text-lg font-semibold mb-4">Tree Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-3 text-[#c15329]" />
                      <div>
                        <p className="text-sm text-gray-500">Total Members</p>
                        <p className="text-lg font-semibold">{currentTree.members.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center text-gray-600">
                      <Heart className="w-5 h-5 mr-3 text-[#c15329]" />
                      <div>
                        <p className="text-sm text-gray-500">Family Types</p>
                        <p className="text-lg font-semibold">
                          {new Set(currentTree.members.map(m => m.type)).size}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center text-gray-600">
                      <ImageIcon className="w-5 h-5 mr-3 text-[#c15329]" />
                      <div>
                        <p className="text-sm text-gray-500">Photos</p>
                        <p className="text-lg font-semibold">
                          {currentTree.members.reduce((sum, m) => sum + (m.photos?.length || 0), 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-3 text-[#c15329]" />
                      <div>
                        <p className="text-sm text-gray-500">Last Updated</p>
                        <p className="text-lg font-semibold">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Recent Activity */}
              <section>
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {/* Add recent activity items here */}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              {/* Members Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Family Members</h2>
                  <p className="text-sm text-gray-500">
                    Manage members and their permissions
                  </p>
                </div>
                {access.canManagePermissions && (
                  <button
                    onClick={() => setShowAdminInfoModal(true)}
                    className="text-sm text-[#c15329] hover:text-[#a84723] flex items-center"
                  >
                    <Shield className="w-4 h-4 mr-1.5" />
                    Admin Management Info
                  </button>
                )}
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={memberFilter}
                    onChange={(e) => setMemberFilter(e.target.value as typeof memberFilter)}
                    className="border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-[#c15329] focus:border-transparent"
                  >
                    <option value="all">All Members</option>
                    <option value="admins">Admins Only</option>
                    <option value="members">Regular Members</option>
                  </select>
                </div>
                {access.canEdit && (
                  <button
                    onClick={() => navigate(`/tree/${currentTree.id}`)}
                    className="inline-flex items-center px-4 py-2 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Member
                  </button>
                )}
              </div>

              {/* Members List */}
              <div className="space-y-4">
                {filteredMembers.map(member => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center flex-grow">
                      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        {member.photo ? (
                          <img
                            src={member.photo}
                            alt={member.firstName}
                            className="w-full h-full rounded-xl object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </h3>
                          <AdminBadge level={member.isCurrentUser ? 'owner' : member.isAdmin ? 'admin' : 'member'} />
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          {member.email && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="w-4 h-4 mr-1.5" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="w-4 h-4 mr-1.5" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {access.canManagePermissions && !member.isCurrentUser && (
                        <PermissionToggle
                          currentLevel={member.isCurrentUser ? 'owner' : member.isAdmin ? 'admin' : 'member'}
                          onUpdateLevel={(level) => handleUpdatePermission(member.id, level)}
                          disabled={!access.canManageAdmins}
                        />
                      )}
                      <Link
                        to={`/member/${member.id}`}
                        className="p-2 text-gray-400 hover:text-[#c15329] rounded-lg hover:bg-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && access.canEdit && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Tree Settings</h2>
              {/* Add settings content */}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTree}
        title="Delete Family Tree"
        message={`Are you sure you want to delete "${currentTree.name}"? This action cannot be undone and all associated data will be permanently deleted.`}
        confirmText="Delete Tree"
        cancelText="Cancel"
        type="danger"
      />

      {/* Admin Info Modal */}
      <AdminInfoModal
        isOpen={showAdminInfoModal}
        onClose={() => setShowAdminInfoModal(false)}
      />
    </div>
  );
};

export default TreeDetailsPage;