import React, { useState, useEffect } from 'react';
import FamilyMemberCard from './familyMembers/FamilyMemberCard';
import AddMemberForm from './AddMemberForm';
import ConnectionLine from './ConnectionLine';
import { FamilyMember } from '../types/FamilyMember';
import { Plus, Link } from 'lucide-react';
import databaseService from '../services/databaseService';

interface FamilyTreeProps {
  initialMembers?: FamilyMember[];
}

interface Connection {
  id: string;
  startMemberId: string;
  endMemberId: string;
  color: string;
  thickness: number;
  lineStyle: 'solid' | 'dashed';
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ initialMembers = [] }) => {
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [startMemberId, setStartMemberId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const dbMembers = await databaseService.getMembers();
        setMembers(dbMembers);
      } catch (error) {
        setError('Failed to fetch family members from the database');
      }
    };
    fetchMembers();
  }, []);

  const addMember = async (newMember: FamilyMember) => {
    try {
      const addedMember = await databaseService.addMember(newMember);
      setMembers(prevMembers => [...prevMembers, addedMember]);
      setShowAddForm(false);
    } catch (error) {
      setError('Failed to add family member. Please try again.');
    }
  };

  const handleStartConnection = (memberId: string) => {
    setIsDrawingConnection(true);
    setStartMemberId(memberId);
  };

  const handleEndConnection = (endMemberId: string) => {
    if (startMemberId && startMemberId !== endMemberId) {
      const newConnection: Connection = {
        id: `${startMemberId}-${endMemberId}`,
        startMemberId,
        endMemberId,
        color: 'black',
        thickness: 2,
        lineStyle: 'solid',
      };
      setConnections(prevConnections => [...prevConnections, newConnection]);
    }
    setIsDrawingConnection(false);
    setStartMemberId(null);
  };

  const updateConnection = (updatedConnection: Connection) => {
    setConnections(prevConnections =>
      prevConnections.map(conn =>
        conn.id === updatedConnection.id ? updatedConnection : conn
      )
    );
  };

  return (
    <div className="relative w-full min-h-[600px] border border-gray-300 p-4">
      {error && (
        <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <button
        className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center"
        onClick={() => setShowAddForm(true)}
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Member
      </button>
      <button
        className={`absolute top-16 right-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center ${
          isDrawingConnection ? 'bg-red-500 hover:bg-red-600' : ''
        }`}
        onClick={() => setIsDrawingConnection(!isDrawingConnection)}
      >
        <Link className="w-5 h-5 mr-2" />
        {isDrawingConnection ? 'Cancel Connection' : 'Draw Connection'}
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-24">
        {members.map(member => (
          <FamilyMemberCard
            key={member.id}
            member={member}
            onStartConnection={handleStartConnection}
            onEndConnection={handleEndConnection}
            isDrawingConnection={isDrawingConnection}
          />
        ))}
      </div>
      {connections.map(connection => (
        <ConnectionLine
          key={connection.id}
          connection={connection}
          members={members}
          updateConnection={updateConnection}
        />
      ))}
      {showAddForm && (
        <AddMemberForm
          onAdd={addMember}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};

export default FamilyTree;