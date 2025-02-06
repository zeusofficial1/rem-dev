import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Users, Image, Mail, Video, Plus, GitBranch, BarChart2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to REM-Me, Jacob</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do's Section */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">To Do's</h2>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                <Check className="w-4 h-4 text-white" />
              </span>
              <span className="line-through">Sign Up to REM-ME</span>
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 border-2 border-gray-300 rounded-full mr-2"></span>
              <span>Finish Your Profile</span>
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 border-2 border-gray-300 rounded-full mr-2"></span>
              <span>Create Your First Tree</span>
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 border-2 border-gray-300 rounded-full mr-2"></span>
              <span>Invite Family</span>
            </li>
            <li className="flex items-center">
              <span className="w-6 h-6 border-2 border-gray-300 rounded-full mr-2"></span>
              <span>Upload Pictures</span>
            </li>
          </ul>
        </div>

        {/* Explore The Possibilities Section */}
        <div className="card p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Explore The Possibilities</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/family-trees" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <GitBranch className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <h3 className="font-semibold">Create a Family Tree</h3>
                    <p className="text-sm text-gray-600">Map your family lineage visually.</p>
                  </div>
                </div>
                <span className="text-blue-500">&gt;</span>
              </Link>
            </li>
            <li>
              <Link to="/invite-family" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Mail className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <h3 className="font-semibold">Invite Family To Your Tree</h3>
                    <p className="text-sm text-gray-600">Let relatives view and contribute to your family tree.</p>
                  </div>
                </div>
                <span className="text-blue-500">&gt;</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Image className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <h3 className="font-semibold">Add Content To Your Profile</h3>
                    <p className="text-sm text-gray-600">Enrich your profile with photos and videos</p>
                  </div>
                </div>
                <span className="text-blue-500">&gt;</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="card p-6">
          <div className="flex items-center mb-4">
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80" alt="Support" className="w-16 h-16 rounded-full mr-4" />
            <div>
              <p className="font-semibold">Hi there, looking for support, book a call today!</p>
              <button className="btn btn-primary mt-2">Book Call</button>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Figure Out REM-me in 20 min</h3>
            <div className="bg-gray-200 h-40 flex items-center justify-center rounded-lg">
              <Video className="w-16 h-16 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity and Support Tickets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <GitBranch className="w-4 h-4 text-blue-500" />
              </span>
              <span>Created a New Family Tree: Smith Family</span>
            </li>
            <li className="flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Users className="w-4 h-4 text-green-500" />
              </span>
              <span>Added 3 new family members</span>
            </li>
          </ul>
        </div>
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Support Tickets</h2>
            <button className="btn btn-secondary flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              Create
            </button>
          </div>
          <p className="text-gray-600">No support tickets available.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;