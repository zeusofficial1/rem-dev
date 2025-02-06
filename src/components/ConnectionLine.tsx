import React from 'react';
import { FamilyMember } from '../types/FamilyTree';

interface ConnectionLineProps {
  startMember: FamilyMember;
  endMember: FamilyMember;
  relationshipType: string;
}

const ConnectionLine: React.FC<ConnectionLineProps> = ({ startMember, endMember, relationshipType }) => {
  const startX = startMember.position.x + 60; // Half of the card width
  const startY = startMember.position.y + 50; // Half of the card height
  const endX = endMember.position.x + 60;
  const endY = endMember.position.y + 50;

  const getLineColor = () => {
    switch (relationshipType) {
      case 'parent':
      case 'child':
        return '#4A5568';
      case 'spouse':
        return '#ED8936';
      case 'sibling':
        return '#4299E1';
      default:
        return '#A0AEC0';
    }
  };

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={getLineColor()}
        strokeWidth="2"
      />
    </svg>
  );
};

export default ConnectionLine;