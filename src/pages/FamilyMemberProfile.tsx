import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, Heart, 
  Users, Image as ImageIcon, Edit2, Dog, Globe,
  Flag, BookOpen, Link as LinkIcon, ChevronRight,
  GitBranch, Cake, Clock, Home, Briefcase, UserPlus,
  Shield, X
} from 'lucide-react';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import { useAuth } from '../contexts/AuthContext';
import { usePermissions } from '../contexts/PermissionContext';
import toast from 'react-hot-toast';

const FamilyMemberProfile: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { trees, getAllFamilyMembers } = useFamilyTree();
  const { user } = useAuth();
  const { checkTreeAccess } = usePermissions();
  const [activeTab, setActiveTab] = useState<'info' | 'gallery' | 'timeline' | 'relationships'>('info');
  const [isLoading, setIsLoading] = useState(true);
  const [member, setMember] = useState<any>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  useEffect(() => {
    const loadMember = async () => {
      if (!memberId) {
        setIsLoading(false);
        return;
      }

      try {
        const allMembers = await getAllFamilyMembers();
        const foundMember = allMembers.find(m => m.id === memberId);
        
        if (foundMember) {
          setMember(foundMember);
        } else {
          toast.error('Member not found');
        }
      } catch (error) {
        console.error('Failed to load member:', error);
        toast.error('Failed to load member details');
      } finally {
        setIsLoading(false);
      }
    };

    loadMember();
  }, [memberId, getAllFamilyMembers]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c15329]"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Member Not Found</h2>
          <p className="mt-2 text-gray-500">This family member doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getNatureCoverImage = (id: string) => {
    const images = [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=80'
    ];
    const index = parseInt(id.substring(0, 8), 16) % images.length;
    return images[index];
  };

  const coverImage = getNatureCoverImage(member.id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-80 bg-gray-900">
        <img 
          src={coverImage}
          alt="Nature Cover"
          className="w-full h-full object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 flex items-center px-3 py-2 bg-black/30 hover:bg-black/40 text-white rounded-lg transition-colors backdrop-blur-sm"
        >
          <X className="w-5 h-5 mr-1" />
          Close
        </button>

        {/* Profile Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto max-w-6xl flex items-end space-x-6">
            <div className="w-32 h-32 rounded-xl bg-white shadow-xl overflow-hidden flex-shrink-0 border-4 border-white">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.firstName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 text-white pb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">
                  {member.firstName} {member.lastName}
                </h1>
                {member.isAdmin && (
                  <span className="px-2 py-1 bg-[#c15329] rounded-full text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  <span className="capitalize">{member.type} Member</span>
                </div>
                {member.livingIn && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{member.livingIn}</span>
                  </div>
                )}
              </div>
            </div>
            {user?.uid === member.userId && (
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="container mx-auto max-w-6xl px-4">
          <nav className="flex space-x-8">
            {['info', 'relationships', 'gallery', 'timeline'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-[#c15329] text-[#c15329]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Personal Information */}
                <div className="md:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {member.birthDate && (
                        <div className="flex items-start">
                          <Cake className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Birth Date</p>
                            <p className="font-medium">{member.birthDate}</p>
                          </div>
                        </div>
                      )}
                      {member.livingIn && (
                        <div className="flex items-start">
                          <Home className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="font-medium">{member.livingIn}</p>
                          </div>
                        </div>
                      )}
                      {member.occupation && (
                        <div className="flex items-start">
                          <Briefcase className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Occupation</p>
                            <p className="font-medium">{member.occupation}</p>
                          </div>
                        </div>
                      )}
                      {member.ethnicity && (
                        <div className="flex items-start">
                          <Globe className="w-5 h-5 text-gray-400 mt-1 mr-3" />
                          <div>
                            <p className="text-sm text-gray-500">Ethnicity</p>
                            <p className="font-medium">{member.ethnicity}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {member.bio && (
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                        <p className="text-gray-700">{member.bio}</p>
                      </div>
                    )}
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-6">Contact Information</h2>
                    <div className="space-y-4">
                      {member.email && (
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-gray-400 mr-3" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center">
                          <Phone className="w-5 h-5 text-gray-400 mr-3" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Links & Stats */}
                <div className="space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Member Since</span>
                        <span className="font-medium">
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Family Trees</span>
                        <span className="font-medium">
                          {member.treeIds?.length || 1}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Photos</span>
                        <span className="font-medium">
                          {member.photos?.length || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {member.pets && member.pets.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-lg font-semibold mb-4">Pets</h2>
                      <div className="space-y-4">
                        {member.pets.map((pet: any) => (
                          <div key={pet.id} className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Dog className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium">{pet.name}</p>
                              <p className="text-sm text-gray-500">{pet.breed}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'relationships' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Family Connections */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-6">Family Connections</h2>
                  <div className="space-y-4">
                    {member.relationships?.length > 0 ? (
                      member.relationships.map((rel: any) => (
                        <div
                          key={rel.personId}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="ml-3">
                              <p className="font-medium capitalize">{rel.type}</p>
                              <p className="text-sm text-gray-500">
                                {rel.personName || 'Family Member'}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No connections found</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Add Connection */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-6">Add Connection</h2>
                  <button
                    onClick={() => {/* Add connection logic */}}
                    className="w-full flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-[#c15329] hover:border-[#c15329] transition-colors"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Add New Connection
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Photo Gallery</h2>
                  <button
                    onClick={() => setShowGalleryModal(true)}
                    className="px-4 py-2 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors"
                  >
                    Add Photos
                  </button>
                </div>
                {member.photos && member.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {member.photos.map((photo: string, index: number) => (
                      <div
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100 group relative"
                      >
                        <img
                          src={photo}
                          alt={`${member.firstName}'s photo ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No photos available</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Life Timeline</h2>
                {member.events && member.events.length > 0 ? (
                  <div className="space-y-6">
                    {member.events.map((event: any, index: number) => (
                      <div key={index} className="relative pl-8 pb-8">
                        <div className="absolute left-0 top-2 w-3 h-3 bg-[#c15329] rounded-full"></div>
                        {index !== member.events.length - 1 && (
                          <div className="absolute left-1.5 top-5 bottom-0 w-px bg-gray-200"></div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">{event.date}</p>
                          <h3 className="font-medium mt-1">{event.title}</h3>
                          <p className="text-gray-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No timeline events available</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FamilyMemberProfile;