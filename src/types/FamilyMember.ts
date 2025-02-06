export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  birthDate?: string;
  deathDate?: string;
  isAlive: boolean;
  gender?: 'male' | 'female' | 'other';
  ethnicity?: string;
  livingIn?: string;
  photo?: string;
  photos: string[];
  type: 'blood' | 'adopted' | 'step' | 'foster' | 'spouse' | 'pet' | 'other';
  relationships: Array<{
    type: 'parent' | 'child' | 'spouse' | 'sibling' | 'owner' | 'pet';
    personId: string;
  }>;
  position: { x: number; y: number };
  events: any[];
  occupation?: string;
  treeIds: string[]; // Array of tree IDs this member belongs to
  userId?: string; // Connected user's ID if this member represents a user
  isCurrentUser?: boolean;
  pets?: Array<{
    id: string;
    name: string;
    type: string;
    breed?: string;
    photo?: string;
  }>;
  species?: string; // For pet type members
  breed?: string; // For pet type members
  generation?: number;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'fish' | 'other';
  breed?: string;
  birthDate?: string;
  photo?: string;
  ownerId: string;
}