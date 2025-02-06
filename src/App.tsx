import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { FamilyTreeProvider } from './contexts/FamilyTreeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { Toaster } from 'react-hot-toast';
import OfflineIndicator from './components/OfflineIndicator';
import ErrorBoundary from './components/ErrorBoundary';
import DashboardPage from './pages/DashboardPage';
import FamilyTreesPage from './pages/FamilyTreesPage';
import FamilyMembersPage from './pages/FamilyMembersPage';
import FamilyTreePage from './pages/FamilyTreePage';
import TreeDetailsPage from './pages/TreeDetailsPage';
import FamilyMemberProfile from './pages/FamilyMemberProfile';
import UserProfilePage from './pages/UserProfilePage';
import GalleryPage from './pages/GalleryPage';
import SettingsPage from './pages/SettingsPage';
import BillingPage from './pages/BillingPage';
import InviteFamilyPage from './pages/InviteFamilyPage';
import SearchDirectoryPage from './pages/SearchDirectoryPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JoinTreePage from './pages/JoinTreePage';
import Layout from './components/Layout';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#c15329]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <FamilyTreeProvider>
            <PermissionProvider>
              <OfflineIndicator />
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/join/:inviteId" element={<JoinTreePage />} />

                {/* Private Routes */}
                <Route path="/" element={
                  <PrivateRoute>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/family-trees" element={
                  <PrivateRoute>
                    <Layout>
                      <FamilyTreesPage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/family-members" element={
                  <PrivateRoute>
                    <Layout>
                      <FamilyMembersPage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/tree/:treeId" element={
                  <PrivateRoute>
                    <Layout>
                      <FamilyTreePage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/tree/:treeId/details" element={
                  <PrivateRoute>
                    <Layout>
                      <TreeDetailsPage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/member/:memberId" element={
                  <PrivateRoute>
                    <Layout>
                      <FamilyMemberProfile />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/profile" element={
                  <PrivateRoute>
                    <Layout>
                      <UserProfilePage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/gallery" element={
                  <PrivateRoute>
                    <Layout>
                      <GalleryPage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/settings" element={
                  <PrivateRoute>
                    <Layout>
                      <SettingsPage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/billing" element={
                  <PrivateRoute>
                    <Layout>
                      <BillingPage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/invite-family" element={
                  <PrivateRoute>
                    <Layout>
                      <InviteFamilyPage />
                    </Layout>
                  </PrivateRoute>
                } />
                <Route path="/search-directory" element={
                  <PrivateRoute>
                    <Layout>
                      <SearchDirectoryPage />
                    </Layout>
                  </PrivateRoute>
                } />

                {/* Catch all redirect to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
              <Toaster position="top-right" />
            </PermissionProvider>
          </FamilyTreeProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;