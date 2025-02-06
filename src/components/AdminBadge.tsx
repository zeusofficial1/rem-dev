import React from 'react';
import { Shield, Crown } from 'lucide-react';

interface AdminBadgeProps {
  level: 'owner' | 'admin' | 'member';
}

const AdminBadge: React.FC<AdminBadgeProps> = ({ level }) => {
  if (level === 'member') return null;

  const badges = {
    owner: {
      icon: Crown,
      text: 'Owner',
      classes: 'bg-[#c15329]/10 text-[#c15329] border-[#c15329]/20',
    },
    admin: {
      icon: Shield,
      text: 'Admin',
      classes: 'bg-blue-100 text-blue-800 border-blue-200',
    },
  };

  const BadgeIcon = badges[level].icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges[level].classes}`}>
      <BadgeIcon className="w-3 h-3 mr-1" />
      {badges[level].text}
    </span>
  );
};

export default AdminBadge;