import React, { useState, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { DndContext, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { FamilyMember } from '../types/FamilyTree';
import FamilyMemberCard from './familyMembers/FamilyMemberCard';
import ConnectionLines from './ConnectionLines';
import ZoomControls from './controls/ZoomControls';

interface FamilyTreeVisualizationProps {
  scale: number;
  members: FamilyMember[];
  onUpdateMember: (memberId: string, updates: Partial<FamilyMember>) => void;
  isConnecting: boolean;
  connectionStart: string | null;
  onStartConnection: (memberId: string) => void;
  onEndConnection: (memberId: string) => void;
  onPreviewMember: (member: FamilyMember) => void;
}

const FamilyTreeVisualization: React.FC<FamilyTreeVisualizationProps> = ({
  scale,
  members,
  onUpdateMember,
  isConnecting,
  connectionStart,
  onStartConnection,
  onEndConnection,
  onPreviewMember,
}) => {
  const [hoveredMember, setHoveredMember] = useState<string | null>(null);
  const [draggingMember, setDraggingMember] = useState<string | null>(null);
  const transformRef = useRef<any>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const handleDragStart = (event: any) => {
    setDraggingMember(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const memberId = active.id as string;
    const member = members.find(m => m.id === memberId);
    
    if (!member) return;

    const currentScale = transformRef.current?.state?.scale || 1;
    
    const newX = Math.round((member.position.x + (delta.x / currentScale)) / 40) * 40;
    const newY = Math.round((member.position.y + (delta.y / currentScale)) / 40) * 40;

    onUpdateMember(memberId, {
      position: { x: newX, y: newY }
    });
    setDraggingMember(null);
  };

  return (
    <div className="w-full h-full overflow-hidden bg-gray-50">
      <TransformWrapper
        ref={transformRef}
        initialScale={scale}
        minScale={0.4}
        maxScale={2}
        wheel={{ step: 0.05 }}
        centerOnInit={true}
        limitToBounds={false}
        smooth={true}
      >
        {({ zoomIn, zoomOut }) => (
          <>
            <div className="fixed bottom-6 right-6 z-[1000]">
              <ZoomControls 
                onZoomIn={() => zoomIn(0.2)}
                onZoomOut={() => zoomOut(0.2)}
              />
            </div>

            <TransformComponent
              wrapperStyle={{
                width: '100%',
                height: '100%'
              }}
              contentStyle={{
                width: '100%',
                height: '100%'
              }}
            >
              <DndContext 
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div
                  className="relative"
                  style={{
                    width: '5000px',
                    height: '3000px',
                    background: `
                      linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                >
                  <ConnectionLines
                    members={members}
                    scale={scale}
                    hoveredMember={hoveredMember}
                    draggingMember={draggingMember}
                  />

                  {members.map((member) => (
                    <FamilyMemberCard
                      key={member.id}
                      member={member}
                      isConnecting={isConnecting}
                      isStartMember={member.id === connectionStart}
                      onStartConnection={onStartConnection}
                      onEndConnection={onEndConnection}
                      onPreviewClick={() => onPreviewMember(member)}
                      onMouseEnter={() => setHoveredMember(member.id)}
                      onMouseLeave={() => setHoveredMember(null)}
                    />
                  ))}
                </div>
              </DndContext>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};

export default FamilyTreeVisualization;