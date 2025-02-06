import React from 'react';
import { Coins } from 'lucide-react';

interface TokenSettingsProps {
  tokenBalance: number;
  setTokenBalance: (balance: number) => void;
}

const TokenSettings: React.FC<TokenSettingsProps> = ({ tokenBalance, setTokenBalance }) => {
  const handlePurchaseTokens = (amount: number) => {
    // In a real application, this would involve a payment process
    setTokenBalance(tokenBalance + amount);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Token Settings</h2>
      <div className="flex items-center mb-4">
        <Coins className="w-6 h-6 mr-2 text-yellow-500" />
        <span className="text-lg font-medium">Current Balance: {tokenBalance} tokens</span>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => handlePurchaseTokens(100)}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Purchase 100 Tokens
        </button>
        <button
          onClick={() => handlePurchaseTokens(500)}
          className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
        >
          Purchase 500 Tokens
        </button>
        <button
          onClick={() => handlePurchaseTokens(1000)}
          className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors"
        >
          Purchase 1000 Tokens
        </button>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Tokens can be used for premium features such as advanced search, AI-powered suggestions, and more.
      </p>
    </div>
  );
};

export default TokenSettings;