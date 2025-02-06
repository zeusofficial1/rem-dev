import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { FamilyMember } from '../types/FamilyTree';

interface ConnectionLinesProps {
  members: FamilyMember[];
  scale: number;
  hoveredMember: string | null;
  draggingMember: string | null;
}

const ConnectionLines: React.FC<ConnectionLinesProps> = ({
  members,
  scale,
  hoveredMember,
  draggingMember
}) => {
  const connections = useMemo(() => {
    const processedPairs = new Set<string>();
    const lines: JSX.Element[] = [];

    members.forEach(member => {
      if (!member.relationships) return;

      member.relationships.forEach(rel => {
        const relatedMember = members.find(m => m.id === rel.personId);
        if (!relatedMember) return;

        const pairId = [member.id, rel.personId].sort().join('-');
        if (processedPairs.has(pairId)) return;
        processedPairs.add(pairId);

        const startX = member.position.x + 160;
        const startY = member.position.y + 90;
        const endX = relatedMember.position.x + 160;
        const endY = relatedMember.position.y + 90;

        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const isHighlighted = hoveredMember === member.id || hoveredMember === rel.personId;
        const isDragging = draggingMember === member.id || draggingMember === rel.personId;
        const isSpouseRelation = rel.type === 'spouse' || member.type === 'spouse' || relatedMember.type === 'spouse';

        const getConnectionStyle = () => {
          if (isSpouseRelation) {
            return {
              color: isDragging ? '#FCA5A5' : isHighlighted ? '#FF0000' : '#FF0000',
              opacity: isDragging ? 0.3 : isHighlighted ? 1 : 0.7,
              width: 2
            };
          }
          return {
            color: isDragging ? '#94A3B8' : isHighlighted ? '#000000' : '#000000',
            opacity: isDragging ? 0.3 : isHighlighted ? 1 : 0.5,
            width: 1
          };
        };

        const style = getConnectionStyle();
        const curvature = Math.min(distance * 0.2, 100);
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        const cp1x = startX + dx / 3;
        const cp1y = startY + (Math.abs(dy) > Math.abs(dx) ? curvature : curvature / 2);
        const cp2x = endX - dx / 3;
        const cp2y = endY - (Math.abs(dy) > Math.abs(dx) ? curvature : curvature / 2);

        const path = `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;

        lines.push(
          <g key={pairId} className="connection-group">
            {/* Connection shadow */}
            <motion.path
              d={path}
              stroke={style.color}
              strokeWidth={style.width + 2}
              strokeOpacity={style.opacity * 0.2}
              fill="none"
              initial={false}
              animate={{
                d: path,
                stroke: style.color,
                strokeOpacity: style.opacity * 0.2
              }}
              transition={{
                duration: 0.2,
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
              stroke={style.color}
              strokeWidth={style.width}
              strokeOpacity={style.opacity}
              fill="none"
              initial={false}
              animate={{
                d: path,
                stroke: style.color,
                strokeOpacity: style.opacity
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
              style={{
                strokeLinecap: 'round',
                strokeLinejoin: 'round'
              }}
            />

            {/* Heart symbol for spouse connections */}
            {isSpouseRelation && (
              <foreignObject
                x={midX - 12}
                y={midY - 12}
                width={24}
                height={24}
                style={{ 
                  transform: `scale(${1/scale})`,
                  transformOrigin: 'center'
                }}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center
                    ${isHighlighted ? 'ring-2 ring-red-500' : ''}
                  `}
                >
                  <Heart 
                    className={`w-4 h-4 ${isHighlighted ? 'text-red-500' : 'text-red-500'}`}
                    fill="currentColor"
                  />
                </div>
              </foreignObject>
            )}
          </g>
        );
      });
    });

    return lines;
  }, [members, hoveredMember, draggingMember, scale]);

  return (
    <svg
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        zIndex: 0
      }}
    >
      <g className="connections-layer">
        {connections}
      </g>
    </svg>
  );
};

export default React.memo(ConnectionLines);