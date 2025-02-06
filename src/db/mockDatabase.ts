import { FamilyMember } from '../types/FamilyMember';
import { FamilyTree } from '../types/FamilyTree';

class MockDatabase {
  private familyMembers: FamilyMember[] = [];
  private familyTrees: FamilyTree[] = [];

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleTree: FamilyTree = {
      id: '1',
      name: 'Sample Family Tree',
      description: 'A sample family tree for testing',
      members: [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          birthDate: '1980-01-01',
          gender: 'male',
          type: 'blood',
          connections: [],
          position: { x: 0, y: 0 },
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Doe',
          birthDate: '1982-05-15',
          gender: 'female',
          type: 'blood',
          connections: [],
          position: { x: 200, y: 0 },
          photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
        },
        {
          id: '3',
          firstName: 'Michael',
          lastName: 'Doe',
          birthDate: '1955-03-22',
          gender: 'male',
          type: 'blood',
          connections: [],
          position: { x: 400, y: 0 },
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80'
        },
        {
          id: '4',
          firstName: 'Sarah',
          lastName: 'Doe',
          birthDate: '1958-07-10',
          gender: 'female',
          type: 'blood',
          connections: [],
          position: { x: 600, y: 0 },
          photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=776&q=80'
        },
        {
          id: '5',
          firstName: 'Emily',
          lastName: 'Doe',
          birthDate: '2010-12-25',
          gender: 'female',
          type: 'blood',
          connections: [],
          position: { x: 800, y: 0 },
          photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
        },
        {
          id: '6',
          firstName: 'Max',
          lastName: 'Smith',
          birthDate: '1985-08-30',
          gender: 'male',
          type: 'spouse',
          connections: [],
          position: { x: 1000, y: 0 },
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
        },
        {
          id: '7',
          firstName: 'Luna',
          lastName: 'Doe',
          birthDate: '2020-02-14',
          gender: 'female',
          type: 'pet',
          species: 'Dog',
          breed: 'Golden Retriever',
          connections: [],
          position: { x: 1200, y: 0 },
          photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=724&q=80'
        }
      ],
    };

    this.familyTrees.push(sampleTree);
    this.familyMembers.push(...sampleTree.members);
  }

  async connect(): Promise<void> {
    console.log('Mock database connected successfully');
  }

  async addTree(tree: Omit<FamilyTree, 'id'>): Promise<FamilyTree> {
    const newTree: FamilyTree = { ...tree, id: Date.now().toString() };
    this.familyTrees.push(newTree);
    return newTree;
  }

  async getTrees(): Promise<FamilyTree[]> {
    return this.familyTrees;
  }

  async getTreeById(id: string): Promise<FamilyTree | undefined> {
    return this.familyTrees.find(tree => tree.id === id);
  }

  async updateTree(updatedTree: FamilyTree): Promise<void> {
    const index = this.familyTrees.findIndex(tree => tree.id === updatedTree.id);
    if (index !== -1) {
      this.familyTrees[index] = updatedTree;
    }
  }

  async deleteTree(id: string): Promise<void> {
    this.familyTrees = this.familyTrees.filter(tree => tree.id !== id);
  }

  async addMember(member: Omit<FamilyMember, 'id'>): Promise<string> {
    const newMember: FamilyMember = { ...member, id: Date.now().toString() };
    this.familyMembers.push(newMember);
    return newMember.id;
  }

  async updateMember(id: string, updates: Partial<FamilyMember>): Promise<void> {
    const index = this.familyMembers.findIndex(m => m.id === id);
    if (index !== -1) {
      this.familyMembers[index] = { ...this.familyMembers[index], ...updates };
    }
  }

  async deleteMember(id: string): Promise<void> {
    this.familyMembers = this.familyMembers.filter(member => member.id !== id);
  }

  async getFamilyMembersByTreeId(treeId: string): Promise<FamilyMember[]> {
    return this.familyMembers.filter(member => member.treeId === treeId);
  }

  async getAllFamilyMembers(): Promise<FamilyMember[]> {
    return this.familyMembers;
  }
}

const mockDatabase = new MockDatabase();
export default mockDatabase;