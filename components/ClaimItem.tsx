import React from 'react';
import { Claim, ClaimStatus, ClaimCategory, Approver } from '../types';
import { CATEGORIES } from '../constants';

interface ClaimItemProps {
  claim: Claim;
  onSelect: (claim: Claim) => void;
  isHighlighted: boolean;
  viewMode: 'myClaims' | 'toApprove';
}

const statusStyles: { [key in ClaimStatus]: { main: string, text: string, dot: string } } = {
  [ClaimStatus.Pending]: { main: 'bg-yellow-100 text-yellow-800', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  [ClaimStatus.Approved]: { main: 'bg-green-100 text-green-800', text: 'text-green-800', dot: 'bg-green-500' },
  [ClaimStatus.Rejected]: { main: 'bg-red-100 text-red-800', text: 'text-red-800', dot: 'bg-red-500' },
};

const ApproverStatus: React.FC<{ approver: Approver }> = ({ approver }) => {
    const style = statusStyles[approver.status];
    const highlightClass = approver.status === ClaimStatus.Approved ? 'bg-green-100' : '';

    return (
        <div className={`flex items-center space-x-2 p-1 rounded-md transition-colors ${highlightClass}`}>
            <span className={`h-2 w-2 rounded-full ${style.dot}`}></span>
            <span className={`text-xs font-medium ${style.text}`}>{approver.name}: {approver.status}</span>
        </div>
    );
};

const ClaimItem: React.FC<ClaimItemProps> = ({ claim, onSelect, isHighlighted, viewMode }) => {
  const categoryInfo = CATEGORIES.find(c => c.value === claim.category);
  const Icon = categoryInfo?.icon || (() => null);
  const overallStatusStyle = statusStyles[claim.status].main;
  const firstProof = claim.proofUrls && claim.proofUrls[0];

  const highlightClass = isHighlighted ? 'claim-highlight' : '';

  return (
    <button 
        onClick={() => onSelect(claim)}
        className={`w-full text-left bg-white rounded-xl shadow-md p-5 flex flex-col space-y-3 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${highlightClass}`}
        aria-label={`View details for ${categoryInfo?.label} claim of ₹${claim.amount.toFixed(2)}`}
    >
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 pointer-events-none">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                <Icon className="h-6 w-6 text-indigo-600" />
                </div>
            </div>
            <div className="flex-1 pointer-events-none">
                <div className="flex justify-between items-center">
                    <h4 className="text-lg font-bold text-slate-800">{categoryInfo?.label}</h4>
                    <span className={`text-lg font-extrabold text-slate-700`}>
                        ₹{claim.amount.toFixed(2)}
                    </span>
                </div>
                <p className="text-sm text-slate-500">{claim.description}</p>
                
                {viewMode === 'toApprove' && (
                    <p className="text-xs text-slate-600 mt-2 font-semibold bg-slate-100 p-1.5 rounded-md inline-block">
                        Submitted by: {claim.submittedBy.name}
                    </p>
                )}
                
                {(claim.category === ClaimCategory.Cab || claim.category === ClaimCategory.Train) && claim.fromLocation && claim.toLocation && (
                    <p className="text-xs text-slate-600 mt-2 font-semibold bg-slate-50 p-1.5 rounded-md inline-block ml-2">
                        Trip: {claim.fromLocation} → {claim.toLocation}
                    </p>
                )}
                {claim.category === ClaimCategory.Food && claim.mealTypes && claim.mealTypes.length > 0 && (
                    <p className="text-xs text-slate-600 mt-2 font-semibold bg-slate-50 p-1.5 rounded-md inline-block ml-2">
                        Meal(s): {claim.mealTypes.join(', ')}
                    </p>
                )}

                <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center space-x-2">
                        {firstProof && (
                           <div className="relative">
                             <img src={firstProof} alt="Proof" className="h-10 w-10 object-cover rounded-md border border-slate-200"/>
                             {claim.proofUrls.length > 1 && (
                               <span className="absolute -top-1 -right-2 bg-indigo-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                 +{claim.proofUrls.length - 1}
                               </span>
                             )}
                           </div>
                        )}
                        <p className="text-xs text-slate-400">{new Date(claim.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {viewMode === 'myClaims' && claim.hasStatusChanged && (
                            <div className="relative flex h-2 w-2" title="Status updated">
                                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>
                                <div className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></div>
                            </div>
                        )}
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${overallStatusStyle}`}>
                            {claim.status}
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        {claim.approvers && claim.approvers.length > 0 && (
            <div className="border-t border-slate-200 pt-3 mt-3 pointer-events-none">
                <h5 className="text-xs font-bold text-slate-500 mb-2">APPROVAL STATUS</h5>
                <div className="space-y-1">
                    {claim.approvers.map(approver => (
                        <ApproverStatus key={approver.id} approver={approver} />
                    ))}
                </div>
            </div>
        )}
    </button>
  );
};

export default ClaimItem;