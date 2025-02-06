import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, X, Calendar, MapPin, Mail, Phone, 
  Image as ImageIcon, Clock, Heart, Dog, 
  ChevronRight, Link as LinkIcon, Plus
} from 'lucide-react';
import { FamilyMember } from '../../types/FamilyMember';
import { Link } from 'react-router-dom';

interface FamilyMemberPreviewSidebarProps {
  member: FamilyMember | null;
  isOpen: boolean;
  onClose: () => void;
}

const FamilyMemberPreviewSidebar: React.FC<FamilyMemberPreviewSidebarProps> = ({
  member,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'timeline' | 'gallery'>('info');

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'gallery', label: 'Gallery' },
  ] as const;

  return (
    <AnimatePresence>
      {isOpen && member && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/25 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50"
          >
            {/* Header with Cover Image */}
            <div className="relative h-48">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
                {member.photo && (
                  <img
                    src={member.photo}
                    alt={member.firstName}
                    className="w-full h-full object-cover opacity-50"
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Profile Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-xl bg-white shadow-lg overflow-hidden flex-shrink-0">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white truncate">
                      {member.firstName} {member.lastName}
                    </h2>
                    <div className="flex items-center mt-1 text-gray-300">
                      <Heart className="w-4 h-4 mr-1.5" />
                      <span className="text-sm capitalize">{member.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-black'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 48px - 200px)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4"
                >
                  {activeTab === 'info' && (
                    <div className="space-y-6">
                      {/* Quick Actions */}
                      <div className="flex space-x-2">
                        <Link
                          to={`/member/${member.id}`}
                          className="flex-1 py-2 px-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-center"
                        >
                          View Full Profile
                        </Link>
                        <button className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors">
                          <LinkIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Personal Information */}
                      <div className="space-y-4">
                        {member.birthDate && (
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                            <span>Born {member.birthDate}</span>
                          </div>
                        )}
                        {member.livingIn && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                            <span>{member.livingIn}</span>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="w-5 h-5 mr-3 text-gray-400" />
                            <span>{member.email}</span>
                          </div>
                        )}
                        {member.phone && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="w-5 h-5 mr-3 text-gray-400" />
                            <span>{member.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Relationships */}
                      <div>
                        <h3 className="font-medium mb-3">Family Connections</h3>
                        <div className="space-y-2">
                          {member.relationships?.map((rel, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-400" />
                                </div>
                                <span className="ml-3 text-sm font-medium capitalize">
                                  {rel.type}
                                </span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                          ))}
                          <button className="w-full flex items-center justify-center p-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:text-black hover:border-black transition-colors">
                            <Plus className="w-4 h-4 mr-2" />
                            <span className="text-sm">Add Connection</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'timeline' && (
                    <div className="space-y-4">
                      {member.events?.length ? (
                        member.events.map((event, index) => (
                          <div key={index} className="relative pl-6 pb-6">
                            <div className="absolute left-0 top-2 w-3 h-3 bg-black rounded-full" />
                            {index !== member.events.length - 1 && (
                              <div className="absolute left-1.5 top-4 bottom-0 w-px bg-gray-200" />
                            )}
                            <div>
                              <p className="text-sm text-gray-500">{event.date}</p>
                              <h4 className="font-medium mt-1">{event.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No events recorded</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'gallery' && (
                    <div>
                      {member.photos?.length ? (
                        <div className="grid grid-cols-2 gap-2">
                          {member.photos.map((photo, index) => (
                            <div
                              key={index}
                              className="aspect-square rounded-lg overflow-hidden group relative"
                            >
                              <img
                                src={photo}
                                alt={`${member.firstName}'s photo ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button className="p-2 bg-white rounded-full">
                                  <ImageIcon className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">No photos available</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FamilyMemberPreviewSidebar;