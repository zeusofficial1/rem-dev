import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { firestore } from '../firebase/config';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, Loader } from 'lucide-react';
import ProfilePhotoUpload from '../components/photos/ProfilePhotoUpload';
import toast from 'react-hot-toast';

interface UserProfile {
  displayName: string;
  email: string;
  phone: string;
  location: string;
  birthDate: string;
  bio: string;
  photoURL?: string;
  notificationPreferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

const defaultProfile: UserProfile = {
  displayName: '',
  email: '',
  phone: '',
  location: '',
  birthDate: '',
  bio: '',
  photoURL: '',
  notificationPreferences: {
    email: true,
    push: true,
    sms: false,
  },
};

const UserProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setProfile({
            ...defaultProfile,
            ...userDoc.data() as UserProfile,
            email: user.email || '',
            photoURL: user.photoURL || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: profile.displayName,
        phone: profile.phone,
        location: profile.location,
        birthDate: profile.birthDate,
        bio: profile.bio,
        notificationPreferences: profile.notificationPreferences,
        updatedAt: new Date().toISOString(),
      });

      await updateProfile(user, {
        displayName: profile.displayName,
      });

      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpdate = async (photoUrl: string) => {
    if (!user) return;

    try {
      await updateProfile(user, { photoURL: photoUrl });
      
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, {
        photoURL: photoUrl,
        updatedAt: new Date().toISOString(),
      });

      setProfile(prev => ({
        ...prev,
        photoURL: photoUrl,
      }));

      toast.success('Profile photo updated successfully');
    } catch (error) {
      console.error('Error updating profile photo:', error);
      toast.error('Failed to update profile photo');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-gray-900 to-gray-800 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Header */}
          <div className="relative px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:space-x-5">
              {/* Avatar with Upload Button */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-4 border-white bg-white overflow-hidden shadow-lg">
                  {profile.photoURL ? (
                    <img 
                      src={profile.photoURL} 
                      alt={profile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                    </div>
                  )}
                  <ProfilePhotoUpload
                    currentPhoto={profile.photoURL}
                    onPhotoUpdate={handlePhotoUpdate}
                  />
                </div>
              </div>

              <div className="mt-6 sm:mt-0 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-gray-900 truncate">
                    {profile.displayName || 'Your Name'}
                  </h1>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                    ) : isEditing ? (
                      <Save className="w-4 h-4 mr-2" />
                    ) : (
                      <Edit2 className="w-4 h-4 mr-2" />
                    )}
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">{profile.bio || 'No bio added yet'}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.displayName}
                          onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                          className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <div className="py-2 pl-10 text-gray-900">{profile.displayName || 'Not set'}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="py-2 pl-10 text-gray-900">{profile.email}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <div className="py-2 pl-10 text-gray-900">{profile.phone || 'Not set'}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <div className="py-2 pl-10 text-gray-900">{profile.location || 'Not set'}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Birth Date</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      {isEditing ? (
                        <input
                          type="date"
                          value={profile.birthDate}
                          onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                          className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <div className="py-2 pl-10 text-gray-900">{profile.birthDate || 'Not set'}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <div className="mt-1">
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.bio || 'No bio added yet'}</p>
                  )}
                </div>
              </div>

              {/* Notification Preferences */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(profile.notificationPreferences).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {key} Notifications
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => {
                            if (isEditing) {
                              setProfile({
                                ...profile,
                                notificationPreferences: {
                                  ...profile.notificationPreferences,
                                  [key]: e.target.checked,
                                },
                              });
                            }
                          }}
                          disabled={!isEditing}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;