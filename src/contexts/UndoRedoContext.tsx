import React, { createContext, useContext, useState, useCallback } from 'react';
import { FamilyTree } from '../types/FamilyTree';

interface UndoRedoContextType {
  canUndo: boolean;
  canRedo: boolean;
  addToHistory: (tree: FamilyTree) => void;
  undo: () => FamilyTree | undefined;
  redo: () => FamilyTree | undefined;
}

const UndoRedoContext = createContext<UndoRedoContextType | undefined>(undefined);

export const useUndoRedo = () => {
  const context = useContext(UndoRedoContext);
  if (!context) {
    throw new Error('useUndoRedo must be used within an UndoRedoProvider');
  }
  return context;
};

export const UndoRedoProvider: React.FC = ({ children }) => {
  const [past, setPast] = useState<FamilyTree[]>([]);
  const [future, setFuture] = useState<FamilyTree[]>([]);

  const addToHistory = useCallback((tree: FamilyTree) => {
    setPast(prev => [...prev, tree]);
    setFuture([]);
  }, []);

  const undo = useCallback(() => {
    if (past.length === 0) return;

    const previous = past[past.length - 1];
    setPast(prev => prev.slice(0, -1));
    setFuture(prev => [previous, ...prev]);

    return previous;
  }, [past]);

  const redo = useCallback(() => {
    if (future.length === 0) return;

    const next = future[0];
    setFuture(prev => prev.slice(1));
    setPast(prev => [...prev, next]);

    return next;
  }, [future]);

  const value = {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    addToHistory,
    undo,
    redo,
  };

  return (
    <UndoRedoContext.Provider value={value}>
      {children}
    </UndoRedoContext.Provider>
  );
};