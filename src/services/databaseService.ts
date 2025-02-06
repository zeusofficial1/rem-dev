import Dexie, { Table } from 'dexie';
import { FamilyTree, FamilyMember } from '../types/FamilyTree';

class FamilyTreeDatabase extends Dexie {
  familyTrees!: Table<FamilyTree>;
  familyMembers!: Table<FamilyMember>;

  constructor() {
    super('FamilyTreeDB');
    this.version(1).stores({
      familyTrees: '++id, name',
      familyMembers: '++id, firstName, lastName, treeId'
    });
  }

  async getFamilyTrees(): Promise<FamilyTree[]> {
    return await this.familyTrees.toArray();
  }

  async createFamilyTree(tree: Omit<FamilyTree, 'id'>): Promise<string> {
    const id = await this.familyTrees.add({
      ...tree,
      id: Date.now().toString()
    });
    return id.toString();
  }

  async getFamilyTreeById(id: string): Promise<FamilyTree | undefined> {
    const tree = await this.familyTrees.get(id);
    if (tree) {
      const members = await this.familyMembers
        .where('treeId')
        .equals(id)
        .toArray();
      return { ...tree, members };
    }
    return undefined;
  }

  async updateFamilyTree(id: string, updates: Partial<FamilyTree>): Promise<void> {
    await this.familyTrees.update(id, updates);
  }

  async deleteFamilyTree(id: string): Promise<void> {
    await this.transaction('rw', this.familyTrees, this.familyMembers, async () => {
      await this.familyMembers.where('treeId').equals(id).delete();
      await this.familyTrees.delete(id);
    });
  }

  async addFamilyMember(treeId: string, member: Omit<FamilyMember, 'id'>): Promise<string> {
    const id = await this.familyMembers.add({
      ...member,
      id: Date.now().toString(),
      treeId
    });
    return id.toString();
  }

  async updateFamilyMember(id: string, updates: Partial<FamilyMember>): Promise<void> {
    await this.familyMembers.update(id, updates);
  }

  async deleteFamilyMember(id: string): Promise<void> {
    await this.familyMembers.delete(id);
  }

  async getFamilyMembersByTreeId(treeId: string): Promise<FamilyMember[]> {
    return await this.familyMembers
      .where('treeId')
      .equals(treeId)
      .toArray();
  }

  async getAllFamilyMembers(): Promise<FamilyMember[]> {
    return await this.familyMembers.toArray();
  }
}

const db = new FamilyTreeDatabase();
export default db;