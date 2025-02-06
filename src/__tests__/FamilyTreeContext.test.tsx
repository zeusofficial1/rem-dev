import React from 'react';
import { render, act } from '@testing-library/react';
import { FamilyTreeProvider, useFamilyTree } from '../contexts/FamilyTreeContext';

const TestComponent: React.FC = () => {
  const { trees, addTree, currentTree, addMember } = useFamilyTree();
  return (
    <div>
      <button onClick={() => addTree('Test Tree')}>Add Tree</button>
      <button onClick={() => addMember({ firstName: 'John', lastName: 'Doe' })}>Add Member</button>
      <div data-testid="tree-count">{trees.length}</div>
      <div data-testid="member-count">{currentTree?.members.length || 0}</div>
    </div>
  );
};

describe('FamilyTreeContext', () => {
  it('should add a new tree', () => {
    const { getByText, getByTestId } = render(
      <FamilyTreeProvider>
        <TestComponent />
      </FamilyTreeProvider>
    );

    act(() => {
      getByText('Add Tree').click();
    });

    expect(getByTestId('tree-count').textContent).toBe('1');
  });

  it('should add a new member to the current tree', () => {
    const { getByText, getByTestId } = render(
      <FamilyTreeProvider>
        <TestComponent />
      </FamilyTreeProvider>
    );

    act(() => {
      getByText('Add Tree').click();
      getByText('Add Member').click();
    });

    expect(getByTestId('member-count').textContent).toBe('1');
  });
});