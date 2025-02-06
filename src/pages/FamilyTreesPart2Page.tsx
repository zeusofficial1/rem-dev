import React from 'react';
import { Link } from 'react-router-dom';
import { FamilyTree } from '../types/FamilyTree';
import { GitBranch, Users } from 'lucide-react';

interface FamilyTreesPart2PageProps {
  trees: FamilyTree[];
}

const FamilyTreesPart2Page: React.FC<FamilyTreesPart2PageProps> = ({ trees }) => {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Family Trees (Part 2)</h1>
      
      {trees.length === 0 ? (
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">You haven't created any family trees yet.</p>
          <Link to="/family-trees" className="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200">
            Create Your First Tree
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trees.map(tree => (
            <div key={tree.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <GitBranch className="w-8 h-8 mr-3 text-green-500" />
                  <h2 className="text-xl font-semibold">{tree.name}</h2>
                </div>
                <p className="text-gray-600 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {tree.members.length} members
                </p>
                <Link
                  to={`/tree/${tree.id}`}
                  className="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-block transition-colors duration-200"
                >
                  View Tree
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyTreesPart2Page;