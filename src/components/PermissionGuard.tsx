import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../contexts/PermissionContext';
import { useAuth } from '../contexts/AuthContext';

interface PermissionGuardProps {
  treeId: string;
  children: React.ReactNode;
  requireEdit?: boolean;
  requireManage?: boolean;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  treeId,
  children,
  requireEdit = false,
  requireManage = false,
}) => {
  const { checkTreeAccess } = usePermissions();
  const { user } = useAuth();
  const access = checkTreeAccess(treeId);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireManage && !access.canManagePermissions) {
    return <Navigate to="/" />;
  }

  if (requireEdit && !access.canEdit) {
    return <Navigate to="/" />;
  }

  if (!access.canView) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};