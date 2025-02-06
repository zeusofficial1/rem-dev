import React, { useEffect, useRef } from 'react';
import { FamilyMember } from '../types/FamilyTree';
import { motion } from 'framer-motion';

interface FamilyTreeConnectionsProps {
  members: FamilyMember[];
  scale: number;
  hoveredMember: string | null;
}

const FamilyTreeConnections: React.FC<FamilyTreeConnectionsProps> = ({
  members,
  scale,
  hoveredMember,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const getConnectionColor = (startId: string, endId: string) => {
    if (hoveredMember === startId || hoveredMember === endId) {
      return {
        stroke: '#3B82F6',
        shadow: 'rgba(59, 130, 246, 0.5)'
      };
    }
    return {
      stroke: '#CBD5E1',
      shadow: 'rgba(203, 213, 225, 0.3)'
    };
  };

  const calculateControlPoints = (
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Adjust curvature based on distance and relative positions
    const baseCurvature = Math.min(distance * 0.2, 120);
    const verticalCurvature = Math.abs(dy) > Math.abs(dx) ? baseCurvature * 1.5 : baseCurvature;
    const horizontalOffset = Math.abs(dx) > Math.abs(dy) ? baseCurvature * 0.5 : baseCurvature;

    // Determine curve direction based on relative positions
    const sign = endY >= startY ? 1 : -1;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    // Calculate control points for smoother curves
    const cp1x = startX + horizontalOffset;
    const cp1y = startY + (sign * verticalCurvature);
    const cp2x = endX - horizontalOffset;
    const cp2y = endY + (sign * verticalCurvature);

    return { cp1x, cp1y, cp2x, cp2y, midX, midY };
  };

  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    const processedPairs = new Set<string>();
    const CARD_WIDTH = 340;
    const CARD_HEIGHT = 240;

    members.forEach(member => {
      if (!member.relationships) return;

      member.relationships.forEach(rel => {
        const relatedMember = members.find(m => m.id === rel.personId);
        if (!relatedMember) return;

        const pairId = [member.id, rel.personId].sort().join('-');
        if (processedPairs.has(pairId)) return;
        processedPairs.add(pairId);

        const startX = member.position.x + CARD_WIDTH / 2;
        const startY = member.position.y + CARD_HEIGHT / 2;
        const endX = relatedMember.position.x + CARD_WIDTH / 2;
        const endY = relatedMember.position.y + CARD_HEIGHT / 2;

        const { cp1x, cp1y, cp2x, cp2y, midX, midY } = calculateControlPoints(startX, startY, endX, endY);
        const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
        const colors = getConnectionColor(member.id, relatedMember.id);

        connections.push(
          <g key={pairId} className="connection-group">
            {/* Connection shadow */}
            <motion.path
              d={path}
              stroke={colors.shadow}
              strokeWidth={4}
              strokeOpacity={0.5}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1
              }}
              transition={{ 
                duration: 0.8,
                ease: "easeInOut"
              }}
              style={{
                filter: 'blur(4px)',
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              }}
            />

            {/* Main connection line */}
            <motion.path
              d={path}
              stroke={colors.stroke}
              strokeWidth={2}
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                stroke: colors.stroke
              }}
              transition={{ 
                duration: 0.6,
                ease: "easeInOut"
              }}
              style={{
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              }}
            />

            {/* Connection point */}
            <motion.circle
              cx={midX}
              cy={midY}
              r={4}
              fill={colors.stroke}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
                fill: colors.stroke
              }}
              transition={{ 
                delay: 0.3,
                duration: 0.3,
                type: "spring",
                stiffness: 200
              }}
            />
          </g>
        );
      });
    });

    return connections;
  };

  return (
    <svg
      ref={svgRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      {renderConnections()}
    </svg>
  );
};

export default FamilyTreeConnections;