import { FamilyMember } from '../types/FamilyMember';

interface TreeNode {
  member: FamilyMember;
  children: TreeNode[];
}

const HORIZONTAL_SPACING = 200;
const VERTICAL_SPACING = 150;

export function calculateTreeLayout(members: FamilyMember[]): FamilyMember[] {
  const rootNodes = buildTree(members);
  let xOffset = 0;

  rootNodes.forEach(node => {
    xOffset = layoutSubtree(node, 0, xOffset);
    xOffset += HORIZONTAL_SPACING;
  });

  return members;
}

function buildTree(members: FamilyMember[]): TreeNode[] {
  const nodeMap = new Map<string, TreeNode>();
  members.forEach(member => {
    nodeMap.set(member.id, { member, children: [] });
  });

  const rootNodes: TreeNode[] = [];

  members.forEach(member => {
    const node = nodeMap.get(member.id)!;
    if (member.connections.length === 0) {
      rootNodes.push(node);
    } else {
      member.connections.forEach(parentId => {
        const parentNode = nodeMap.get(parentId);
        if (parentNode) {
          parentNode.children.push(node);
        }
      });
    }
  });

  return rootNodes;
}

function layoutSubtree(node: TreeNode, depth: number, xOffset: number): number {
  const y = depth * VERTICAL_SPACING;

  if (node.children.length === 0) {
    node.member.position = { x: xOffset, y };
    return xOffset + HORIZONTAL_SPACING;
  }

  const childrenWidth = node.children.reduce((width, child) => {
    return width + layoutSubtree(child, depth + 1, xOffset);
  }, 0);

  const x = xOffset + (childrenWidth - HORIZONTAL_SPACING) / 2;
  node.member.position = { x, y };

  return childrenWidth;
}