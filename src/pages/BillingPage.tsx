import React, { useState } from 'react';
import { CreditCard, Check, Clock, Download, AlertCircle } from 'lucide-react';

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

const BillingPage: React.FC = () => {
  const [currentPlan] = useState('pro');
  const [paymentHistory] = useState<PaymentHistory[]>([
    {
      id: '1',
      date: '2024-03-15',
      amount: 19.99,
      status: 'completed',
      description: 'Pro Plan - Monthly'
    },
    {
      id: '2',
      date: '2024-02-15',
      amount: 19.99,
      status: 'completed',
      description: 'Pro Plan - Monthly'
    },
    {
      id: '3',
      date: '2024-01-15',
      amount: 19.99,
      status: 'completed',
      description: 'Pro Plan - Monthly'
    }
  ]);

  const plans = [
    {
      name: 'Basic',
      price: 9.99,
      features: [
        'Up to 100 family members',
        'Basic tree visualization',
        'Email support',
      ],
    },
    {
      name: 'Pro',
      price: 19.99,
      features: [
        'Up to 500 family members',
        'Advanced tree visualization',
        'Priority email support',
        'Family events calendar',
      ],
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: 39.99,
      features: [
        'Unlimited family members',
        'Advanced tree visualization',
        '24/7 phone support',
        'Family events calendar',
        'DNA integration',
        'Custom branding',
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>

        {/* Current Plan */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Pro Plan</h3>
                <p className="text-gray-600">$19.99/month</p>
              </div>
              <button className="btn btn-primary">
                Change Plan
              </button>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <CreditCard className="w-4 h-4 mr-2" />
              Next billing date: April 15, 2024
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Payment History</h2>
            <button className="flex items-center text-sm text-gray-600 hover:text-black">
              <Download className="w-4 h-4 mr-1" />
              Download All
            </button>
          </div>
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span className={`ml-2 ${getStatusColor(payment.status)}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button className="text-gray-600 hover:text-black">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Available Plans */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-lg p-6 flex flex-col border-2 ${
                  currentPlan === plan.name.toLowerCase() 
                    ? 'border-black' 
                    : 'border-gray-200'
                }`}
              >
                {plan.recommended && (
                  <span className="bg-black text-white text-xs font-bold uppercase px-3 py-1 rounded-full self-start mb-4">
                    Recommended
                  </span>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-3xl font-bold mb-4">
                  ${plan.price}
                  <span className="text-lg font-normal text-gray-600">/month</span>
                </p>
                <ul className="mb-8 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center mb-2">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    currentPlan === plan.name.toLowerCase()
                      ? 'bg-gray-100 text-gray-400 cursor-default'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                  disabled={currentPlan === plan.name.toLowerCase()}
                >
                  {currentPlan === plan.name.toLowerCase() ? 'Current Plan' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;