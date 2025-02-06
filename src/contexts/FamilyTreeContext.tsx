import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getFirestore, enableNetwork, disableNetwork } from 'firebase/firestore';
import { FamilyTree, FamilyMember } from '../types/FamilyTree';
import db from '../services/databaseService';
import toast from 'react-hot-toast';

interface FamilyTreeContextType {
  trees: FamilyTree[];
  currentTree: FamilyTree | null;
  addTree: (name: string) => Promise<void>;
  deleteTree: (treeId: string) => Promise<void>;
  setCurrentTree: (treeId: string) => Promise<void>;
  addMember: (treeId: string, member: Omit<FamilyMember, 'id'>) => Promise<void>;
  updateMember: (treeId: string, memberId: string, updates: Partial<FamilyMember>) => Promise<void>;
  getAllFamilyMembers: () => Promise<FamilyMember[]>;
}

const FamilyTreeContext = createContext<FamilyTreeContextType | undefined>(undefined);

export const useFamilyTree = () => {
  const context = useContext(FamilyTreeContext);
  if (!context) {
    throw new Error('useFamilyTree must be used within a FamilyTreeProvider');
  }
  return context;
};

export const FamilyTreeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trees, setTrees] = useState<FamilyTree[]>([]);
  const [currentTree, setCurrentTreeState] = useState<FamilyTree | null>(null);

  // Handle offline/online state
  useEffect(() => {
    const handleOnline = async () => {
      const db = getFirestore();
      await enableNetwork(db);
    };

    const handleOffline = async () => {
      const db = getFirestore();
      await disableNetwork(db);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load trees on mount
  useEffect(() => {
    const loadTrees = async () => {
      try {
        const fetchedTrees = await db.getFamilyTrees();
        setTrees(fetchedTrees);
      } catch (error) {
        console.error('Failed to load trees:', error);
        toast.error('Failed to load family trees');
      }
    };

    loadTrees();
  }, []);

  const addTree = useCallback(async (name: string) => {
    try {
      const newTreeId = await db.createFamilyTree({ name, members: [] });
      const newTree = await db.getFamilyTreeById(newTreeId);
      if (newTree) {
        setTrees(prev => [...prev, newTree]);
        setCurrentTreeState(newTree);
      }
      toast.success('Family tree created successfully');
    } catch (error) {
      console.error('Failed to create tree:', error);
      toast.error('Failed to create family tree');
      throw error;
    }
  }, []);

  const deleteTree = useCallback(async (treeId: string) => {
    try {
      await db.deleteFamilyTree(treeId);
      setTrees(prev => prev.filter(tree => tree.id !== treeId));
      if (currentTree?.id === treeId) {
        setCurrentTreeState(null);
      }
      toast.success('Family tree deleted successfully');
    } catch (error) {
      console.error('Failed to delete tree:', error);
      toast.error('Failed to delete family tree');
      throw error;
    }
  }, [currentTree]);

  const setCurrentTree = useCallback(async (treeId: string) => {
    try {
      const tree = await db.getFamilyTreeById(treeId);
      if (tree) {
        setCurrentTreeState(tree);
      } else {
        throw new Error('Tree not found');
      }
    } catch (error) {
      console.error('Failed to load tree:', error);
      toast.error('Failed to load family tree');
      throw error;
    }
  }, []);

  const addMember = useCallback(async (treeId: string, member: Omit<FamilyMember, 'id'>) => {
    try {
      const memberId = await db.addFamilyMember(treeId, member);
      const updatedTree = await db.getFamilyTreeById(treeId);
      if (updatedTree) {
        setTrees(prev => prev.map(tree => 
          tree.id === treeId ? updatedTree : tree
        ));
        if (currentTree?.id === treeId) {
          setCurrentTreeState(updatedTree);
        }
      }
      toast.success('Family member added successfully');
      return memberId;
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error('Failed to add family member');
      throw error;
    }
  }, [currentTree]);

  const updateMember = useCallback(async (treeId: string, memberId: string, updates: Partial<FamilyMember>) => {
    try {
      await db.updateFamilyMember(memberId, updates);
      const updatedTree = await db.getFamilyTreeById(treeId);
      if (updatedTree) {
        setTrees(prev => prev.map(tree => 
          tree.id === treeId ? updatedTree : tree
        ));
        if (currentTree?.id === treeId) {
          setCurrentTreeState(updatedTree);
        }
      }
      toast.success('Family member updated successfully');
    } catch (error) {
      console.error('Failed to update member:', error);
      toast.error('Failed to update family member');
      throw error;
    }
  }, [currentTree]);

  const getAllFamilyMembers = useCallback(async () => {
    try {
      return await db.getAllFamilyMembers();
    } catch (error) {
      console.error('Failed to get family members:', error);
      toast.error('Failed to load family members');
      throw error;
    }
  }, []);

  const value = {
    trees,
    currentTree,
    addTree,
    deleteTree,
    setCurrentTree,
    addMember,
    updateMember,
    getAllFamilyMembers,
  };

  return (
    <FamilyTreeContext.Provider value={value}>
      {children}
    </FamilyTreeContext.Provider>
  );
};

export default FamilyTreeProvider;