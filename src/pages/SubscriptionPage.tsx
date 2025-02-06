import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface Plan {
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
}

const plans: Plan[] = [
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

const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    // Here you would typically integrate with a payment processor
    console.log(`Selected plan: ${planName}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Subscription Plan</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`bg-white rounded-lg shadow-md p-6 flex flex-col ${
              plan.recommended ? 'border-2 border-blue-500' : ''
            }`}
          >
            {plan.recommended && (
              <span className="bg-blue-500 text-white text-xs font-bold uppercase px-3 py-1 rounded-full self-start mb-4">
                Recommended
              </span>
            )}
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <p className="text-4xl font-bold mb-6">${plan.price}<span className="text-lg font-normal">/month</span></p>
            <ul className="mb-8 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center mb-2">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleSelectPlan(plan.name)}
              className={`w-full py-2 px-4 rounded-md transition-colors ${
                selectedPlan === plan.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
            >
              {selectedPlan === plan.name ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;