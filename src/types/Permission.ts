export type PermissionLevel = 'owner' | 'admin' | 'member' | 'none';

export interface TreePermission {
  treeId: string;
  userId: string;
  level: PermissionLevel;
  addedBy?: string;
  addedAt: string;
}

export interface TreeAccess {
  canView: boolean;
  canEdit: boolean;
  canInvite: boolean;
  canManagePermissions: boolean;
  canManageAdmins: boolean;
  isAdmin: boolean;
}