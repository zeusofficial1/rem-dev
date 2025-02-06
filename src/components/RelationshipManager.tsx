import React, { useState } from 'react';
import { Relationship, FamilyMember } from '../types/FamilyMember';
import { Plus, X } from 'lucide-react';

interface RelationshipManagerProps {
  member: FamilyMember;
  allMembers: FamilyMember[];
  onAddRelationship: (relationship: Omit<Relationship, 'id'>) => void;
  onRemoveRelationship: (relationshipId: string) => void;
}

const RelationshipManager: React.FC<RelationshipManagerProps> = ({
  member,
  allMembers,
  onAddRelationship,
  onRemoveRelationship,
}) => {
  const [newRelationType, setNewRelationType] = useState('');
  const [newRelationMemberId, setNewRelationMemberId] = useState('');

  const handleAddRelationship = () => {
    if (newRelationType && newRelationMemberId) {
      onAddRelationship({
        type: newRelationType,
        memberId: newRelationMemberId,
      });
      setNewRelationType('');
      setNewRelationMemberId('');
    }
  };

  const availableMembers = allMembers.filter(m => m.id !== member.id);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Relationships</h3>
      <ul className="space-y-2">
        {member.relationships && member.relationships.map((relationship) => (
          <li key={relationship.id} className="flex items-center justify-between">
            <span>
              {relationship.type} - {allMembers.find(m => m.id === relationship.memberId)?.firstName} {allMembers.find(m => m.id === relationship.memberId)?.lastName}
            </span>
            <button
              onClick={() => onRemoveRelationship(relationship.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex space-x-2">
        <input
          type="text"
          value={newRelationType}
          onChange={(e) => setNewRelationType(e.target.value)}
          placeholder="Relationship type"
          className="flex-grow px-2 py-1 border rounded"
        />
        <select
          value={newRelationMemberId}
          onChange={(e) => setNewRelationMemberId(e.target.value)}
          className="px-2 py-1 border rounded"
        >
          <option value="">Select member</option>
          {availableMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.firstName} {m.lastName}
            </option>
          ))}
        </select>
        <button
          onClick={handleAddRelationship}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          disabled={!newRelationType || !newRelationMemberId}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default RelationshipManager;