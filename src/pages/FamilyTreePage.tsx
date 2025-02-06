import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFamilyTree } from '../contexts/FamilyTreeContext';
import FamilyTreeVisualization from '../components/FamilyTreeVisualization';
import FamilyMembersSidebar from '../components/FamilyMembersSidebar';
import AddFamilyMemberModal from '../components/AddFamilyMemberModal';
import FamilyMemberPreviewSidebar from '../components/familyMembers/FamilyMemberPreviewSidebar';
import { Plus, GitBranch } from 'lucide-react';
import toast from 'react-hot-toast';

const FamilyTreePage: React.FC = () => {
  const { treeId } = useParams<{ treeId: string }>();
  const navigate = useNavigate();
  const { trees, currentTree, setCurrentTree, addMember, updateMember } = useFamilyTree();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<string | null>(null);
  const [previewMember, setPreviewMember] = useState<FamilyMember | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTree = async () => {
      if (!treeId) return;
      
      setIsLoading(true);
      try {
        await setCurrentTree(treeId);
      } catch (error) {
        console.error('Failed to load tree:', error);
        toast.error('Failed to load family tree');
      } finally {
        setIsLoading(false);
      }
    };

    loadTree();
  }, [treeId, setCurrentTree]);

  const handleAddMember = async (newMember: Omit<FamilyMember, 'id'>) => {
    if (!currentTree) return;
    
    try {
      const position = calculateNewMemberPosition(currentTree.members);
      await addMember(currentTree.id, { 
        ...newMember, 
        position,
        relationships: []
      });
      setIsAddModalOpen(false);
      toast.success('Family member added successfully');
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add family member');
    }
  };

  const calculateNewMemberPosition = (members: FamilyMember[]) => {
    if (members.length === 0) {
      return { x: 100, y: 100 };
    }

    const lastMember = members[members.length - 1];
    const gridSize = Math.ceil(Math.sqrt(members.length + 1));
    const column = members.length % gridSize;
    const row = Math.floor(members.length / gridSize);

    return {
      x: 100 + column * 400,
      y: 100 + row * 300
    };
  };

  const handleUpdateMember = async (memberId: string, updates: Partial<FamilyMember>) => {
    if (!currentTree) return;
    
    try {
      await updateMember(currentTree.id, memberId, updates);
    } catch (error) {
      console.error('Failed to update member:', error);
      toast.error('Failed to update family member');
    }
  };

  const handleStartConnection = (memberId: string) => {
    setIsConnecting(true);
    setConnectionStart(memberId);
  };

  const handleEndConnection = (memberId: string) => {
    if (connectionStart && memberId && connectionStart !== memberId) {
      const startMember = currentTree?.members.find(m => m.id === connectionStart);
      if (startMember) {
        handleUpdateMember(connectionStart, {
          relationships: [
            ...(startMember.relationships || []),
            { type: 'custom', personId: memberId }
          ]
        });
      }
    }
    setIsConnecting(false);
    setConnectionStart(null);
  };

  const handleMemberSelect = (member: FamilyMember) => {
    // Center the tree view on the selected member
    // This is a placeholder - implement actual centering logic
    setPreviewMember(member);
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c15329]"></div>
      </div>
    );
  }

  if (!currentTree) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <GitBranch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Family Tree Not Found</h2>
          <p className="mt-2 text-gray-500">The tree you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 relative">
      {/* Fixed Header */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <GitBranch className="w-5 h-5 text-[#c15329] mr-2" />
            <h1 className="text-xl font-semibold">{currentTree.name}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-3 py-1.5 bg-[#c15329] text-white rounded-lg hover:bg-[#a84723] transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Member
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow pt-16 relative">
        <FamilyTreeVisualization
          scale={1}
          members={currentTree.members}
          onUpdateMember={handleUpdateMember}
          isConnecting={isConnecting}
          connectionStart={connectionStart}
          onStartConnection={handleStartConnection}
          onEndConnection={handleEndConnection}
          onPreviewMember={handleMemberSelect}
        />
        
        <FamilyMembersSidebar
          members={currentTree.members}
          onMemberSelect={handleMemberSelect}
        />
      </div>

      <AddFamilyMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
        existingMembers={currentTree.members}
      />

      <FamilyMemberPreviewSidebar
        member={previewMember}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
};

export default FamilyTreePage;