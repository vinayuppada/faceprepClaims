import React from 'react';
import { Claim, ClaimStatus } from '../types';
import TrendingUpIcon from './icons/TrendingUpIcon';
import ClockIcon from './icons/ClockIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

interface SummaryCardsProps {
  claims: Claim[];
}

interface SummaryCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    iconBgColor: string;
    iconTextColor: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ icon, title, value, iconBgColor, iconTextColor }) => (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center gap-4 transition-transform hover:scale-105">
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${iconBgColor}`}>
            <div className={`h-6 w-6 ${iconTextColor}`}>
                {icon}
            </div>
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);


const SummaryCards: React.FC<SummaryCardsProps> = ({ claims }) => {
  const stats = React.useMemo(() => {
    return claims.reduce(
      (acc, claim) => {
        acc.totalAmount += claim.amount;
        if (claim.status === ClaimStatus.Pending) acc.pendingCount++;
        if (claim.status === ClaimStatus.Approved) acc.approvedCount++;
        if (claim.status === ClaimStatus.Rejected) acc.rejectedCount++;
        return acc;
      },
      { totalAmount: 0, pendingCount: 0, approvedCount: 0, rejectedCount: 0 }
    );
  }, [claims]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
            icon={<TrendingUpIcon />}
            title="Total Amount"
            value={`₹${stats.totalAmount.toFixed(2)}`}
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
        />
        <SummaryCard 
            icon={<ClockIcon />}
            title="Pending"
            value={stats.pendingCount}
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
        />
        <SummaryCard 
            icon={<CheckCircleIcon />}
            title="Approved"
            value={stats.approvedCount}
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
        />
        <SummaryCard 
            icon={<XCircleIcon />}
            title="Rejected"
            value={stats.rejectedCount}
            iconBgColor="bg-red-100"
            iconTextColor="text-red-600"
        />
    </div>
  );
};

export default SummaryCards;
