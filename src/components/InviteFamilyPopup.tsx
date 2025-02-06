import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

interface InviteFamilyPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const InviteFamilyPopup: React.FC<InviteFamilyPopupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  const sendInvitationEmail = async (email: string) => {
    // This is a mock function to simulate sending an email
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log(`Invitation email sent to: ${email}`);
        resolve();
      }, 1500); // Simulate a delay of 1.5 seconds
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setMessage('');

    try {
      await sendInvitationEmail(email);
      setMessage('Invitation sent successfully!');
      setEmail('');
      setTimeout(() => {
        onClose();
        setMessage('');
      }, 2000);
    } catch (error) {
      setMessage('Failed to send invitation. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Invite Family Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
              disabled={isSending}
            />
          </div>
          {message && (
            <div className={`mb-4 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}
          <button
            type="submit"
            className={`w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 flex items-center justify-center ${
              isSending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSending}
          >
            {isSending ? (
              'Sending...'
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Send Invitation
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteFamilyPopup;