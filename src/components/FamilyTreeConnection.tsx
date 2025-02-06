import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FamilyMember } from '../types/FamilyTree';

interface FamilyTreeConnectionProps {
  startMember: FamilyMember;
  endMember: FamilyMember;
  relationshipType: string;
}

const FamilyTreeConnection: React.FC<FamilyTreeConnectionProps> = ({ startMember, endMember, relationshipType }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const updateConnection = () => {
      if (!svgRef.current || !pathRef.current || !circleRef.current) return;

      const cardWidth = 256;
      const cardHeight = 160;

      const startRect = document.getElementById(startMember.id)?.getBoundingClientRect();
      const endRect = document.getElementById(endMember.id)?.getBoundingClientRect();
      const svgRect = svgRef.current.getBoundingClientRect();

      if (!startRect || !endRect) return;

      const startX = startRect.left + cardWidth / 2 - svgRect.left;
      const startY = startRect.top + cardHeight / 2 - svgRect.top;
      const endX = endRect.left + cardWidth / 2 - svgRect.left;
      const endY = endRect.top + cardHeight / 2 - svgRect.top;

      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      const path = `M ${startX} ${startY} Q ${midX} ${startY}, ${midX} ${midY} T ${endX} ${endY}`;
      pathRef.current.setAttribute('d', path);
      circleRef.current.setAttribute('cx', midX.toString());
      circleRef.current.setAttribute('cy', midY.toString());
    };

    updateConnection();
    window.addEventListener('resize', updateConnection);
    const observer = new MutationObserver(updateConnection);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true });

    return () => {
      window.removeEventListener('resize', updateConnection);
      observer.disconnect();
    };
  }, [startMember, endMember]);

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

  const lineColor = getLineColor();

  return (
    <svg
      ref={svgRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <defs>
        <marker
          id={`arrowhead-${relationshipType}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill={lineColor} />
        </marker>
      </defs>
      <motion.path
        ref={pathRef}
        fill="none"
        stroke={lineColor}
        strokeWidth="2"
        markerEnd={`url(#arrowhead-${relationshipType})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.circle
        ref={circleRef}
        r="4"
        fill={lineColor}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      />
    </svg>
  );
};

export default FamilyTreeConnection;