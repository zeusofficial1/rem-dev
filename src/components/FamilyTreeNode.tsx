import React, { useRef, useEffect } from 'react';
import { FamilyMember } from '../types/FamilyMember';
import Draggable from 'react-draggable';
import { User, Calendar, MapPin, Heart, Plus, Link } from 'lucide-react';

interface FamilyTreeNodeProps {
  member: FamilyMember;
  updatePosition: (id: string, x: number, y: number) => void;
  onAddRelative: (memberId: string) => void;
  onStartConnection: (memberId: string) => void;
  onEndConnection: (memberId: string) => void;
  isDrawingConnection: boolean;
}

const FamilyTreeNode: React.FC<FamilyTreeNodeProps> = ({
  member,
  updatePosition,
  onAddRelative,
  onStartConnection,
  onEndConnection,
  isDrawingConnection,
}) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: any, data: { x: number; y: number }) => {
    updatePosition(member.id, data.x, data.y);
  };

  useEffect(() => {
    if (nodeRef.current) {
      const { width, height } = nodeRef.current.getBoundingClientRect();
      updatePosition(member.id, member.position.x, member.position.y);
    }
  }, []);

  const handleConnectionClick = () => {
    if (isDrawingConnection) {
      onEndConnection(member.id);
    } else {
      onStartConnection(member.id);
    }
  };

  // Ensure position values are numbers
  const position = {
    x: typeof member.position.x === 'string' ? parseFloat(member.position.x) : member.position.x,
    y: typeof member.position.y === 'string' ? parseFloat(member.position.y) : member.position.y,
  };

  return (
    <Draggable
      position={position}
      onStop={handleDrag}
      bounds="parent"
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className="family-tree-node absolute bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64 cursor-move transition-all duration-300 hover:shadow-xl hover:scale-105"
        style={{ zIndex: 10 }}
      >
        {/* ... (rest of the component remains the same) */}
      </div>
    </Draggable>
  );
};

export default FamilyTreeNode;