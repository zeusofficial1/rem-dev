import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { FamilyTreeProvider } from '../../contexts/FamilyTreeContext';
import FamilyTreePage from '../FamilyTreePage';

// Mock the useFamilyTree hook
jest.mock('../../contexts/FamilyTreeContext', () => ({
  ...jest.requireActual('../../contexts/FamilyTreeContext'),
  useFamilyTree: () => ({
    getTreeById: jest.fn().mockResolvedValue({
      id: '1',
      name: 'Test Family Tree',
      members: []
    }),
    updateTree: jest.fn()
  })
}));

describe('FamilyTreePage', () => {
  it('renders loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/tree/1']}>
        <FamilyTreeProvider>
          <Routes>
            <Route path="/tree/:treeId" element={<FamilyTreePage />} />
          </Routes>
        </FamilyTreeProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Loading Family Tree...')).toBeInTheDocument();
  });

  it('renders family tree after loading', async () => {
    render(
      <MemoryRouter initialEntries={['/tree/1']}>
        <FamilyTreeProvider>
          <Routes>
            <Route path="/tree/:treeId" element={<FamilyTreePage />} />
          </Routes>
        </FamilyTreeProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Family Tree')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
  });

  // Add more tests for search functionality, adding members, etc.
});