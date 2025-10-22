import React, { useState, useRef, useEffect } from 'react';
import { Claim, ClaimStatus } from '../types';
import { CATEGORIES } from '../constants';
import Modal from './Modal';
import EyeIcon from './icons/EyeIcon';
import CheckIcon from './icons/CheckIcon';
import XIcon from './icons/XIcon';
import SendIcon from './icons/SendIcon';

interface ClaimDetailsProps {
  claim: Claim | null;
  onClose: () => void;
  onEdit: (claim: Claim) => void;
  onApprove: (claimId: string) => Promise<void>;
  onReject: (claimId: string) => Promise<void>;
  onSendMessage: (claimId: string, message: string) => Promise<void>;
  viewMode: 'myClaims' | 'toApprove';
  currentUserId: string;
}

const statusStyles: { [key in ClaimStatus]: { text: string, dot: string } } = {
  [ClaimStatus.Pending]: { text: 'text-yellow-800', dot: 'bg-yellow-500' },
  [ClaimStatus.Approved]: { text: 'text-green-800', dot: 'bg-green-500' },
  [ClaimStatus.Rejected]: { text: 'text-red-800', dot: 'bg-red-500' },
};

const DetailRow: React.FC<{ label: string; value?: string | number | string[] | null }> = ({ label, value }) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
        <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-slate-800">{Array.isArray(value) ? value.join(', ') : value}</p>
        </div>
    );
};

const ClaimDetails: React.FC<ClaimDetailsProps> = ({ claim, onClose, onEdit, onApprove, onReject, onSendMessage, viewMode, currentUserId }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
        chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [claim?.chatHistory]);

  if (!claim) return null;

  const categoryInfo = CATEGORIES.find(c => c.value === claim.category);
  const isApproverActionPending = claim.approvers?.some(a => a.id === currentUserId && a.status === ClaimStatus.Pending);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim() && claim && !isSubmitting) {
        setIsSubmitting(true);
        await onSendMessage(claim.id, chatMessage.trim());
        setChatMessage('');
        setIsSubmitting(false);
    }
  };

  const handleApproval = async (action: 'approve' | 'reject') => {
      if (isSubmitting || !claim) return;
      setIsSubmitting(true);
      if (action === 'approve') {
          await onApprove(claim.id);
      } else {
          await onReject(claim.id);
      }
      setIsSubmitting(false);
      // The modal is no longer closed automatically to allow for chat follow-up.
  };

  const renderActionButtons = () => {
    const actionContainerClass = "flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-200";
    if (viewMode === 'toApprove') {
      return (
        <div className={actionContainerClass}>
           <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
                Close
            </button>
          {isApproverActionPending && (
            <>
              <button
                type="button"
                onClick={() => handleApproval('reject')}
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-300"
              >
                <XIcon className="h-4 w-4" /> {isSubmitting ? 'Rejecting...' : 'Reject'}
              </button>
              <button
                type="button"
                onClick={() => handleApproval('approve')}
                disabled={isSubmitting}
                className="w-full sm:w-auto flex items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300"
              >
                <CheckIcon className="h-4 w-4" /> {isSubmitting ? 'Approving...' : 'Approve'}
              </button>
            </>
          )}
        </div>
      );
    }

    return (
        <div className={actionContainerClass}>
            <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
            >
                Close
            </button>
            <button
                type="button"
                onClick={() => onEdit(claim)}
                className="w-full sm:w-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
                Edit Claim
            </button>
        </div>
    );
  };

  return (
    <Modal isOpen={!!claim} onClose={onClose} title="Claim Details">
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start p-4 bg-slate-50 rounded-lg">
                <div>
                    <p className="text-sm text-slate-500">{categoryInfo?.label}</p>
                    <h3 className="text-3xl font-bold text-slate-800">₹{claim.amount.toFixed(2)}</h3>
                    <p className="text-sm text-slate-500">{new Date(claim.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusStyles[claim.status].text.replace('text-', 'bg-').replace('-800', '-100')}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[claim.status].dot}`}></span>
                    <span className="font-semibold text-sm">{claim.status}</span>
                </div>
            </div>

            {/* General Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow label="Submitted By" value={claim.submittedBy.name} />
                <DetailRow label="Invoice / OIF No." value={claim.invoiceNumber} />
                <DetailRow label="Description" value={claim.description} />
                <DetailRow label="Meal Type(s)" value={claim.mealTypes} />
                <DetailRow label="From" value={claim.fromLocation} />
                <DetailRow label="To" value={claim.toLocation} />
                <DetailRow label="Cab Type" value={claim.cabType} />
                <DetailRow label="Booking App" value={claim.bookingApp} />
                <DetailRow label="Co-Passenger(s)" value={claim.coPassengers} />
            </div>

            {/* Approvers */}
            {claim.approvers && claim.approvers.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-bold text-slate-600 mb-2">Approval Status</h4>
                    <ul className="space-y-2">
                        {claim.approvers.map(approver => (
                            <li 
                                key={approver.id} 
                                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${approver.statusChanged ? 'bg-sky-100' : ''}`}
                            >
                                <span className={`h-2 w-2 rounded-full ${statusStyles[approver.status].dot}`}></span>
                                <span className={`font-medium ${statusStyles[approver.status].text}`}>{approver.name}</span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[approver.status].text.replace('text-', 'bg-').replace('-800', '-100')}`}>{approver.status}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Receipts */}
            {claim.proofUrls && claim.proofUrls.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                     <h4 className="text-sm font-bold text-slate-600 mb-2">Receipts</h4>
                     <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {claim.proofUrls.map((url, index) => (
                             <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="relative group aspect-square">
                                <img src={url} alt={`Receipt ${index + 1}`} className="w-full h-full object-cover rounded-lg border border-slate-200" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center rounded-lg">
                                    <EyeIcon className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                                </div>
                             </a>
                        ))}
                     </div>
                </div>
            )}

            {/* Chat History */}
            <div className="border-t border-slate-200 pt-4">
                <h4 className="text-sm font-bold text-slate-600 mb-3">Claim Discussion</h4>
                <div ref={chatHistoryRef} className="max-h-48 overflow-y-auto space-y-4 pr-2 bg-slate-50 p-3 rounded-md">
                    {claim.chatHistory && claim.chatHistory.length > 0 ? (
                        claim.chatHistory.map(msg => (
                            <div key={msg.id}>
                                {msg.type === 'system' ? (
                                    <p className="text-xs text-center text-slate-500 italic">
                                        {msg.content} &mdash; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                ) : (
                                    <div className={`flex flex-col ${msg.senderId === currentUserId ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-xs">{msg.senderName}</span>
                                            <span className="text-xs text-slate-400">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.senderId === currentUserId ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                                            <p className="text-sm break-words">{msg.content}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 text-center py-4">No messages yet. Start the conversation!</p>
                    )}
                </div>
                <form onSubmit={handleChatSubmit} className="mt-3 flex items-center gap-2">
                    <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        aria-label="Chat message input"
                        disabled={isSubmitting}
                    />
                    <button type="submit" className="flex-shrink-0 h-10 w-10 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 disabled:bg-indigo-300" disabled={!chatMessage.trim() || isSubmitting} aria-label="Send message">
                        <SendIcon className="h-5 w-5"/>
                    </button>
                </form>
            </div>
        </div>
        {renderActionButtons()}
    </Modal>
  );
};

export default ClaimDetails;