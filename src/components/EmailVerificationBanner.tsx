import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail } from 'lucide-react';

const EmailVerificationBanner: React.FC = () => {
  const { user, sendVerificationEmail } = useAuth();

  if (!user || user.emailVerified) return null;

  return (
    <div className="bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex-1 flex items-center">
            <span className="flex p-2">
              <Mail className="h-6 w-6 text-yellow-600" aria-hidden="true" />
            </span>
            <p className="ml-3 font-medium text-yellow-700">
              Please verify your email address to access all features.
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <button
              onClick={sendVerificationEmail}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-yellow-600 bg-white hover:bg-yellow-50"
            >
              Resend verification email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;