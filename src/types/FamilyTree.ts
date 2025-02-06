// Add createdAt field to FamilyTree interface
export interface FamilyTree {
  id: string;
  name: string;
  members: FamilyMember[];
  createdAt?: string;
}

// Add generation field to FamilyMember interface
export interface FamilyMember {
  // ... existing fields ...
  generation?: number;
}