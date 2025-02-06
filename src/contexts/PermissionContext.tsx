import React, { createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { TreePermission, PermissionLevel, TreeAccess } from '../types/Permission';
import toast from 'react-hot-toast';

interface PermissionContextType {
  checkTreeAccess: (treeId: string) => TreeAccess;
  getUserPermissionLevel: (treeId: string) => PermissionLevel;
  grantAccess: (treeId: string, userId: string, level: PermissionLevel) => Promise<void>;
  revokeAccess: (treeId: string, userId: string) => Promise<void>;
  isTreeVisible: (treeId: string) => boolean;
  isMemberVisible: (memberId: string, treeId: string) => boolean;
  updateMemberPermission: (treeId: string, memberId: string, level: PermissionLevel) => Promise<void>;
  getMemberPermission: (treeId: string, memberId: string) => PermissionLevel;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<TreePermission[]>([]);

  const checkTreeAccess = useCallback((treeId: string): TreeAccess => {
    if (!user) {
      return {
        canView: false,
        canEdit: false,
        canInvite: false,
        canManagePermissions: false,
        canManageAdmins: false,
        isAdmin: false,
      };
    }

    const permission = permissions.find(p => p.treeId === treeId && p.userId === user.uid);
    
    switch (permission?.level) {
      case 'owner':
        return {
          canView: true,
          canEdit: true,
          canInvite: true,
          canManagePermissions: true,
          canManageAdmins: true,
          isAdmin: true,
        };
      case 'admin':
        return {
          canView: true,
          canEdit: true,
          canInvite: true,
          canManagePermissions: true,
          canManageAdmins: false,
          isAdmin: true,
        };
      case 'member':
        return {
          canView: true,
          canEdit: false,
          canInvite: false,
          canManagePermissions: false,
          canManageAdmins: false,
          isAdmin: false,
        };
      default:
        return {
          canView: false,
          canEdit: false,
          canInvite: false,
          canManagePermissions: false,
          canManageAdmins: false,
          isAdmin: false,
        };
    }
  }, [user, permissions]);

  const getUserPermissionLevel = useCallback((treeId: string): PermissionLevel => {
    if (!user) return 'none';
    const permission = permissions.find(p => p.treeId === treeId && p.userId === user.uid);
    return permission?.level || 'none';
  }, [user, permissions]);

  const getMemberPermission = useCallback((treeId: string, memberId: string): PermissionLevel => {
    const permission = permissions.find(p => p.treeId === treeId && p.userId === memberId);
    return permission?.level || 'member';
  }, [permissions]);

  const updateMemberPermission = useCallback(async (treeId: string, memberId: string, level: PermissionLevel) => {
    if (!user) throw new Error('Not authenticated');

    const userAccess = checkTreeAccess(treeId);
    if (!userAccess.canManagePermissions) {
      throw new Error('Insufficient permissions');
    }

    // Don't allow non-owners to modify owner permissions
    const targetPermission = permissions.find(p => p.treeId === treeId && p.userId === memberId);
    if (targetPermission?.level === 'owner' && level !== 'owner') {
      throw new Error('Cannot modify owner permissions');
    }

    // Only owners can create new admins
    if (level === 'admin' && !userAccess.canManageAdmins) {
      throw new Error('Only owners can manage admin permissions');
    }

    try {
      // In a real app, this would be a database call
      setPermissions(prev => {
        const index = prev.findIndex(p => p.treeId === treeId && p.userId === memberId);
        if (index === -1) {
          return [...prev, {
            treeId,
            userId: memberId,
            level,
            addedBy: user.uid,
            addedAt: new Date().toISOString(),
          }];
        }
        const updated = [...prev];
        updated[index] = { ...updated[index], level };
        return updated;
      });

      toast.success(`Member permissions updated to ${level}`);
    } catch (error) {
      console.error('Failed to update permissions:', error);
      toast.error('Failed to update member permissions');
      throw error;
    }
  }, [user, permissions, checkTreeAccess]);

  const grantAccess = useCallback(async (treeId: string, userId: string, level: PermissionLevel) => {
    if (!user) throw new Error('Not authenticated');

    const userAccess = checkTreeAccess(treeId);
    if (!userAccess.canManagePermissions) {
      throw new Error('Insufficient permissions');
    }

    const newPermission: TreePermission = {
      treeId,
      userId,
      level,
      addedBy: user.uid,
      addedAt: new Date().toISOString(),
    };

    setPermissions(prev => [...prev, newPermission]);
  }, [user, checkTreeAccess]);

  const revokeAccess = useCallback(async (treeId: string, userId: string) => {
    if (!user) throw new Error('Not authenticated');

    const userAccess = checkTreeAccess(treeId);
    if (!userAccess.canManagePermissions) {
      throw new Error('Insufficient permissions');
    }

    const targetPermission = permissions.find(p => p.treeId === treeId && p.userId === userId);
    if (targetPermission?.level === 'owner') {
      throw new Error('Cannot revoke owner permissions');
    }

    setPermissions(prev => prev.filter(p => !(p.treeId === treeId && p.userId === userId)));
  }, [user, checkTreeAccess, permissions]);

  const isTreeVisible = useCallback((treeId: string): boolean => {
    if (!user) return false;
    const access = checkTreeAccess(treeId);
    return access.canView;
  }, [user, checkTreeAccess]);

  const isMemberVisible = useCallback((memberId: string, treeId: string): boolean => {
    if (!user) return false;
    const permission = permissions.find(p => p.treeId === treeId && p.userId === user.uid);
    return !!permission;
  }, [user, permissions]);

  const value = {
    checkTreeAccess,
    getUserPermissionLevel,
    grantAccess,
    revokeAccess,
    isTreeVisible,
    isMemberVisible,
    updateMemberPermission,
    getMemberPermission,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};