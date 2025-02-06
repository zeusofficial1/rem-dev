import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Check, Users, Image, Mail, Video, GitBranch, 
  BarChart2, Calendar, Bell, BookOpen, Plus, ChevronRight 
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'Guest';

  const quickActions = [
    {
      icon: GitBranch,
      title: 'Create Family Tree',
      description: 'Start mapping your family lineage',
      link: '/family-trees',
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      title: 'Add Family Members',
      description: 'Build your family network',
      link: '/family-members',
      color: 'bg-green-500',
    },
    {
      icon: Image,
      title: 'Upload Photos',
      description: 'Share family memories',
      link: '/gallery',
      color: 'bg-purple-500',
    },
    {
      icon: Mail,
      title: 'Invite Family',
      description: 'Grow your family tree',
      link: '/invite-family',
      color: 'bg-orange-500',
    },
  ];

  const recentActivity = [
    {
      icon: GitBranch,
      text: 'Created a New Family Tree: Smith Family',
      time: '2 hours ago',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Users,
      text: 'Added 3 new family members',
      time: '5 hours ago',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Image,
      text: 'Uploaded 5 new photos to gallery',
      time: '1 day ago',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
        <p className="text-blue-100">Track your progress and manage your family tree all in one place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="group p-4 rounded-xl border border-gray-200 hover:border-blue-500 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`${action.color} p-3 rounded-lg text-white`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">View all</button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${activity.color}`}>
                    <activity.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-500 line-through">Create your account</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-3"></div>
                <span>Create your first family tree</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-3"></div>
                <span>Add family members</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-3"></div>
                <span>Upload family photos</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-3"></div>
                <span>Invite family members</span>
              </div>
            </div>
          </div>

          {/* Support Card */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" 
                alt="Support" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">Need help?</h3>
                <p className="text-sm text-gray-500">Our support team is here for you</p>
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Book a Call
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="space-y-3">
              <Link to="/gallery" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Image className="w-5 h-5 mr-3" />
                <span>Family Gallery</span>
              </Link>
              <Link to="/calendar" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Calendar className="w-5 h-5 mr-3" />
                <span>Family Calendar</span>
              </Link>
              <Link to="/notifications" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <Bell className="w-5 h-5 mr-3" />
                <span>Notifications</span>
              </Link>
              <Link to="/documents" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
                <BookOpen className="w-5 h-5 mr-3" />
                <span>Family Documents</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;