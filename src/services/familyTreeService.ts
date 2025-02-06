import FamilyTree, { IFamilyTree } from '../models/FamilyTree';
import FamilyMember, { IFamilyMember } from '../models/FamilyMember';

export const createFamilyTree = async (treeData: Partial<IFamilyTree>): Promise<IFamilyTree> => {
  const newTree = new FamilyTree(treeData);
  return await newTree.save();
};

export const getFamilyTreeById = async (id: string): Promise<IFamilyTree | null> => {
  return await FamilyTree.findById(id).populate('members');
};

export const updateFamilyTree = async (id: string, treeData: Partial<IFamilyTree>): Promise<IFamilyTree | null> => {
  return await FamilyTree.findByIdAndUpdate(id, treeData, { new: true });
};

export const deleteFamilyTree = async (id: string): Promise<boolean> => {
  const result = await FamilyTree.findByIdAndDelete(id);
  return !!result;
};

export const addFamilyMember = async (treeId: string, memberData: Partial<IFamilyMember>): Promise<IFamilyMember> => {
  const newMember = new FamilyMember(memberData);
  const savedMember = await newMember.save();
  await FamilyTree.findByIdAndUpdate(treeId, { $push: { members: savedMember._id } });
  return savedMember;
};

export const updateFamilyMember = async (id: string, memberData: Partial<IFamilyMember>): Promise<IFamilyMember | null> => {
  return await FamilyMember.findByIdAndUpdate(id, memberData, { new: true });
};

export const deleteFamilyMember = async (treeId: string, memberId: string): Promise<boolean> => {
  const result = await FamilyMember.findByIdAndDelete(memberId);
  if (result) {
    await FamilyTree.findByIdAndUpdate(treeId, { $pull: { members: memberId } });
    return true;
  }
  return false;
};