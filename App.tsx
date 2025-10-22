import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Claim, ClaimStatus, ChatMessage, Notification } from './types';
import Header from './components/Header';
import ClaimForm from './components/ClaimForm';
import ClaimList from './components/ClaimList';
import Modal from './components/Modal';
import PlusIcon from './components/icons/PlusIcon';
import FilterBar from './components/FilterBar';
import ClaimDetails from './components/ClaimDetails';
import ProfileModal from './components/ProfileModal';
import SummaryCards from './components/SummaryCards';
import ViewToggle from './components/ViewToggle';
import { CATEGORIES } from './constants';
import { apiService } from './services/apiService';

const currentUser = { id: 'mgr2', name: 'Jane Smith' };

const App: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit' | null>(null);
  const [claimToEdit, setClaimToEdit] = useState<Claim | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [filters, setFilters] = useState({ category: 'All', status: 'All' });
  const [sortBy, setSortBy] = useState('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewLayout, setViewLayout] = useState<'list' | 'grid'>('list');
  const [highlightedClaimId, setHighlightedClaimId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'myClaims' | 'toApprove'>('myClaims');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const fetchNotifications = useCallback(async () => {
    try {
        const fetchedNotifications = await apiService.fetchNotifications();
        setNotifications(fetchedNotifications);
    } catch (e) {
        console.error("Failed to load notifications:", e);
    }
  }, []);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
        const [fetchedClaims, fetchedNotifications] = await Promise.all([
            apiService.fetchClaims(),
            apiService.fetchNotifications()
        ]);
        setClaims(fetchedClaims);
        setNotifications(fetchedNotifications);
        setError(null);
    } catch (e) {
        setError("Failed to load data. Please try again later.");
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchAllData();
  }, [fetchAllData, activeView]);


  useEffect(() => {
    if (highlightedClaimId) {
      const timer = setTimeout(() => {
        setHighlightedClaimId(null);
      }, 4000); // Highlight lasts for 4 seconds
      return () => clearTimeout(timer);
    }
  }, [highlightedClaimId]);

  const handleFormSubmit = async (claimData: Omit<Claim, 'id' | 'status' | 'submittedBy'> | Claim) => {
    try {
      const submittedClaim = await apiService.submitClaim(claimData);
      await fetchAllData(); // Refetch all data to get new claims and notifications
      setHighlightedClaimId(submittedClaim.id);
    } catch (e) {
      console.error("Failed to submit claim:", e);
      setError("Your claim could not be saved. Please try again.");
    } finally {
      setFormMode(null);
      setClaimToEdit(null);
    }
  };

  const handleApprovalAction = async (claimId: string, action: 'approve' | 'reject') => {
    try {
      const actionFn = action === 'approve' ? apiService.approveClaim : apiService.rejectClaim;
      const updatedClaim = await actionFn(claimId);
      
      setClaims(prev => prev.map(c => (c.id === claimId ? updatedClaim : c)));

      if (selectedClaim?.id === claimId) {
          setSelectedClaim(updatedClaim);
      }
      setHighlightedClaimId(claimId);
      fetchNotifications(); // Refetch to see notification generated for submitter (if it's you)
    } catch (e) {
      console.error(`Failed to ${action} claim:`, e);
      setError(`The claim could not be ${action}d. Please try again.`);
    }
  };

  const handleApprove = (claimId: string) => handleApprovalAction(claimId, 'approve');
  const handleReject = (claimId: string) => handleApprovalAction(claimId, 'reject');
  
  const handleSendMessage = async (claimId: string, messageContent: string) => {
    try {
      const updatedClaim = await apiService.sendMessage(claimId, messageContent);
      setClaims(prev => prev.map(c => c.id === claimId ? updatedClaim : c));
      setSelectedClaim(updatedClaim);
      fetchNotifications(); // Refetch to get new message notifications
    } catch(e) {
      console.error("Failed to send message:", e);
      setError("Your message could not be sent. Please try again.");
    }
  };

  const handleClaimSelect = (claim: Claim) => {
    setSelectedClaim(claim);
    if (claim.hasStatusChanged) {
        setClaims(prevClaims => prevClaims.map(c => {
            if (c.id === claim.id) {
                const readApprovers = c.approvers?.map(a => ({ ...a, statusChanged: false }));
                return { ...c, hasStatusChanged: false, approvers: readApprovers };
            }
            return c;
        }));
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
        apiService.markNotificationAsRead(notification.id);
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    }
    
    const targetClaim = claims.find(c => c.id === notification.claimId);
    if (targetClaim) {
        const isMyClaim = targetClaim.submittedBy.id === currentUser.id;
        const targetView = isMyClaim ? 'myClaims' : 'toApprove';
        if (activeView !== targetView) {
            setActiveView(targetView);
        }
        handleClaimSelect(targetClaim);
    } else {
        setError(`Could not find the associated claim (ID: ${notification.claimId}). It may have been deleted.`);
    }
  };

  const handleMarkAllAsRead = async () => {
    apiService.markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const openEditForm = (claim: Claim) => {
    setSelectedClaim(null);
    setClaimToEdit(claim);
    setFormMode('edit');
  };

  const myClaims = useMemo(() => {
    return claims.filter(c => c.submittedBy.id === currentUser.id);
  }, [claims]);

  const claimsForApproval = useMemo(() => {
    return claims.filter(c => c.approvers?.some(a => a.id === currentUser.id));
  }, [claims]);

  const claimsToShow = activeView === 'myClaims' ? myClaims : claimsForApproval;

  const sortedAndFilteredClaims = useMemo(() => {
    const filtered = claimsToShow.filter(claim => {
      const categoryMatch = filters.category === 'All' || claim.category === filters.category;
      const statusMatch = filters.status === 'All' || claim.status === filters.status;
      return categoryMatch && statusMatch;
    });

    const searched = filtered.filter(claim => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const categoryInfo = CATEGORIES.find(c => c.value === claim.category);
        return (
            claim.description.toLowerCase().includes(query) ||
            claim.amount.toString().includes(query) ||
            claim.submittedBy.name.toLowerCase().includes(query) ||
            (claim.invoiceNumber && claim.invoiceNumber.toLowerCase().includes(query)) ||
            (claim.fromLocation && claim.fromLocation.toLowerCase().includes(query)) ||
            (claim.toLocation && claim.toLocation.toLowerCase().includes(query)) ||
            (claim.coPassengers && claim.coPassengers.toLowerCase().includes(query)) ||
            (categoryInfo?.label.toLowerCase().includes(query))
        );
    });

    return searched.sort((a, b) => {
        switch (sortBy) {
            case 'date-asc':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case 'amount-desc':
                return b.amount - a.amount;
            case 'amount-asc':
                return a.amount - b.amount;
            case 'date-desc':
            default:
                return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
    });
  }, [claimsToShow, filters, sortBy, searchQuery]);

  const TabButton: React.FC<{view: 'myClaims' | 'toApprove'; label: string;}> = ({ view, label }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeView === view
          ? 'bg-indigo-600 text-white shadow'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
  
  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-10 text-slate-500">Loading claims...</div>;
    }
    if (error) {
       return <div className="text-center p-10 bg-red-50 text-red-700 rounded-lg">{error}</div>;
    }
    return (
       <ClaimList 
          claims={sortedAndFilteredClaims} 
          onClaimSelect={handleClaimSelect}
          highlightedClaimId={highlightedClaimId}
          viewMode={activeView}
          viewLayout={viewLayout}
        />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans text-slate-800">
      <Header 
        onProfileClick={() => setIsProfileVisible(true)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
      <main className="container mx-auto p-4 md:p-8">

        <div className="mb-4">
          <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <TabButton view="myClaims" label="My Claims" />
            <TabButton view="toApprove" label="Claims to Approve" />
          </div>
        </div>

        {activeView === 'myClaims' && <SummaryCards claims={myClaims} />}

        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-slate-700">
              {activeView === 'myClaims' ? 'Your Claim History' : 'Approve Employee Claims'}
            </h2>
            <div className="flex items-center gap-2 md:gap-4">
              <FilterBar 
                onFilterChange={setFilters} 
                onSortChange={setSortBy} 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <ViewToggle view={viewLayout} onViewChange={setViewLayout} />
              {activeView === 'myClaims' && (
                <button
                    onClick={() => setFormMode('add')}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all flex-shrink-0"
                    aria-label="Add new claim"
                >
                    <PlusIcon className="h-5 w-5" />
                    <span className="hidden md:inline">Add New Claim</span>
                    <span className="md:hidden">New</span>
                </button>
              )}
            </div>
        </div>
        {renderContent()}
        
        {/* ADD / EDIT MODAL */}
        <Modal
            isOpen={formMode !== null}
            onClose={() => {
              setFormMode(null);
              setClaimToEdit(null);
            }}
            title={formMode === 'edit' ? "Edit Claim" : "Submit a New Claim"}
        >
            <ClaimForm
                onSubmit={handleFormSubmit}
                onCancel={() => {
                  setFormMode(null);
                  setClaimToEdit(null);
                }}
                claimToEdit={claimToEdit}
            />
        </Modal>

        {/* DETAILS MODAL */}
        <ClaimDetails 
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onEdit={openEditForm}
          onApprove={handleApprove}
          onReject={handleReject}
          onSendMessage={handleSendMessage}
          viewMode={activeView}
          currentUserId={currentUser.id}
        />

        {/* PROFILE MODAL */}
        <ProfileModal
          isOpen={isProfileVisible}
          onClose={() => setIsProfileVisible(false)}
        />
      </main>
    </div>
  );
};

export default App;