import React from 'react';
import { formatCurrency } from '../utils/formatters';
interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon
}) => {
  return <div className="bg-white rounded-lg shadow-md p-6 transition hover:shadow-lg">
      <div className="flex items-start">
        <div className="mr-4 bg-primary bg-opacity-10 text-primary p-3 rounded-full">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-neutral-dark mb-1">{title}</h3>
          <p className="text-2xl font-bold text-primary mb-2">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>;
};
const Stats: React.FC = () => {
  return <div className="bg-neutral-light py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-neutral-dark mb-12">
          Our Impact in Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard title="Meals Redirected" value="24,568" description="Meals saved from waste and provided to those in need" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>} />
          <StatCard title="Value Saved" value={formatCurrency(3250000)} description="Economic value of food redirected from waste" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>} />
          <StatCard title="Recycling Partnerships" value="42" description="Waste management partners in our circular network" icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 19l5-5 5 5"></path>
                <path d="M12 14V5"></path>
                <path d="M7 5l5 5 5-5"></path>
              </svg>} />
        </div>
      </div>
    </div>;
};
export default Stats;