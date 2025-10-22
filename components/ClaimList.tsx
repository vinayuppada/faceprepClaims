import React from 'react';
import { Claim } from '../types';
import ClaimItem from './ClaimItem';

interface ClaimListProps {
  claims: Claim[];
  onClaimSelect: (claim: Claim) => void;
  highlightedClaimId?: string | null;
  viewMode: 'myClaims' | 'toApprove';
  viewLayout: 'list' | 'grid';
}

const ClaimList: React.FC<ClaimListProps> = ({ claims, onClaimSelect, highlightedClaimId, viewMode, viewLayout }) => {
  if (claims.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-slate-700">No matching claims found.</h3>
        <p className="text-slate-500">Try adjusting your filters or submit a new claim.</p>
      </div>
    );
  }

  const containerClasses = viewLayout === 'list'
    ? "space-y-4"
    : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4";

  return (
    <div className={containerClasses}>
      {claims.map(claim => (
        <ClaimItem 
          key={claim.id} 
          claim={claim} 
          onSelect={onClaimSelect}
          isHighlighted={claim.id === highlightedClaimId}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default ClaimList;