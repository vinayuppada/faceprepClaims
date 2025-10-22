
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Claim, ClaimCategory, MealType, CabType, BookingApp, ClaimStatus, Approver } from '../types';
import { CATEGORIES } from '../constants';
import { ALL_EMPLOYEES } from '../data/employees';
import UploadIcon from './icons/UploadIcon';
import EyeIcon from './icons/EyeIcon';
import DownloadIcon from './icons/DownloadIcon';
import XIcon from './icons/XIcon';
import PlusIcon from './icons/PlusIcon';
import DocumentIcon from './icons/DocumentIcon';
import SparklesIcon from './icons/SparklesIcon';
import { extractInfoFromReceipt } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';

interface ClaimFormProps {
  onSubmit: (claim: Omit<Claim, 'id' | 'status' | 'submittedBy'> | Claim) => void;
  onCancel: () => void;
  claimToEdit?: Claim | null;
}

const inputStyles = "mt-1 block w-full border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-slate-50 focus:bg-white transition-colors disabled:bg-slate-200 disabled:cursor-not-allowed";
const selectStyles = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-slate-50 focus:bg-white transition-colors";

type Employee = { id: string; name: string };
type AnalysisStatus = { type: 'idle' | 'analyzing' | 'success' | 'error', message: string };

const mealAllowances: { [key in MealType]: number } = {
    [MealType.Breakfast]: 75,
    [MealType.Lunch]: 100,
    [MealType.Dinner]: 100,
};

const ClaimForm: React.FC<ClaimFormProps> = ({ onSubmit, onCancel, claimToEdit }) => {
  // Form states
  const [category, setCategory] = useState<ClaimCategory>(ClaimCategory.Food);
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [selectedApprovers, setSelectedApprovers] = useState<Employee[]>(claimToEdit ? claimToEdit.approvers as Employee[] : [ALL_EMPLOYEES[0]]);
  const [approverSearch, setApproverSearch] = useState('');
  const [approverResults, setApproverResults] = useState<Employee[]>([]);

  // Category specific states
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [cabType, setCabType] = useState<CabType | null>(null);
  const [bookingApp, setBookingApp] = useState<BookingApp | null>(null);
  const [coPassengers, setCoPassengers] = useState('');
  
  // UI states
  const [proofFiles, setProofFiles] = useState<(File | string)[]>([]);
  const [error, setError] = useState<string>('');
  const searchResultsRef = useRef<HTMLUListElement>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>({ type: 'idle', message: '' });
  
  const isReceiptOptional = category === ClaimCategory.Food || category === ClaimCategory.Laundry;
  const isDescriptionOptional = category === ClaimCategory.Food || category === ClaimCategory.Laundry;
  
  // New state for all employees to allow adding new ones
  const [allEmployees, setAllEmployees] = useState<Employee[]>(ALL_EMPLOYEES);


  useEffect(() => {
    if (claimToEdit) {
      setCategory(claimToEdit.category);
      setAmount(String(claimToEdit.amount));
      setDate(claimToEdit.date);
      setDescription(claimToEdit.description);
      setInvoiceNumber(claimToEdit.invoiceNumber || '');
      setSelectedApprovers(claimToEdit.approvers?.map(a => ({id: a.id, name: a.name})) || []);
      setProofFiles(claimToEdit.proofUrls);
      setMealTypes(claimToEdit.mealTypes || []);
      setFromLocation(claimToEdit.fromLocation || '');
      setToLocation(claimToEdit.toLocation || '');
      setCabType(claimToEdit.cabType || null);
      setBookingApp(claimToEdit.bookingApp || null);
      setCoPassengers(claimToEdit.coPassengers || '');
    }
  }, [claimToEdit]);


  useEffect(() => {
    // Reset category-specific fields when category changes
    if(!claimToEdit){
      setMealTypes([]);
      setCabType(null);
      setBookingApp(null);
      setFromLocation('');
      setToLocation('');
      setCoPassengers('');
       if (category !== ClaimCategory.Food) {
        setAmount('');
      }
    }
  }, [category, claimToEdit]);
  
  useEffect(() => {
    if (category === ClaimCategory.Food) {
        const totalAmount = mealTypes.reduce((sum, type) => {
            return sum + (mealAllowances[type] || 0);
        }, 0);
        setAmount(String(totalAmount));
    }
  }, [mealTypes, category]);


  useEffect(() => {
    if (approverSearch.trim()) {
        const searchTerm = approverSearch.trim().toLowerCase();
        const selectedIds = new Set(selectedApprovers.map(a => a.id));
        
        // Filter from the state, not the constant import
        const filtered = allEmployees.filter(
            emp => emp.name.toLowerCase().includes(searchTerm) && !selectedIds.has(emp.id)
        );

        // If no results, show an option to add a new one
        if (filtered.length === 0) {
            setApproverResults([{ id: 'ADD_NEW', name: approverSearch.trim() }]);
        } else {
            setApproverResults(filtered.slice(0, 5)); // Show top 5 results
        }
    } else {
        setApproverResults([]);
    }
  }, [approverSearch, selectedApprovers, allEmployees]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const firstFile = newFiles[0];
      setProofFiles(prev => prev.concat(newFiles));
      setError('');

      // FIX: Use `instanceof File` as a type guard to address TypeScript errors.
      // This ensures `firstFile` is treated as a `File` object before its properties are accessed,
      // resolving issues where its type was inferred as 'unknown'.
      if (firstFile instanceof File && firstFile.type.startsWith('image/')) {
        setAnalysisStatus({ type: 'analyzing', message: 'Analyzing receipt...' });
        try {
          const base64Image = await fileToBase64(firstFile);
          const result = await extractInfoFromReceipt(base64Image, firstFile.type);
          if (result) {
            if (result.amount) setAmount(result.amount.toString());
            if (result.date) setDate(result.date);
            if (result.category && Object.values(ClaimCategory).includes(result.category as ClaimCategory)) {
              setCategory(result.category as ClaimCategory);
            }
            setAnalysisStatus({ type: 'success', message: 'Receipt details extracted! Please verify.' });
          } else {
            setAnalysisStatus({ type: 'error', message: 'Could not extract details. Please enter manually.' });
          }
        } catch (err) {
          console.error("Receipt analysis failed:", err);
          setAnalysisStatus({ type: 'error', message: 'An error occurred during analysis.' });
        }
      }
    }
  }, []);
  
  const getFileUrl = (file: File | string) => {
    return typeof file === 'string' ? file : URL.createObjectURL(file);
  }
  
  const getFileName = (file: File | string) => {
    return typeof file === 'string' ? 'existing-proof.jpg' : file.name;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errorParts: string[] = [];
    if (!amount || parseFloat(amount) <= 0 && category !== ClaimCategory.Food) errorParts.push('a valid amount');
    if (!description && !isDescriptionOptional) errorParts.push('a description');
    if (selectedApprovers.length === 0) errorParts.push('at least one approver');
    if (!isReceiptOptional && proofFiles.length === 0) errorParts.push('a receipt');

    if (errorParts.length > 0) {
        setError(`Please provide: ${errorParts.join(', ')}.`);
        return;
    }
    setError('');

    const approvers: Approver[] = selectedApprovers.map(approver => ({
        id: approver.id,
        name: approver.name,
        status: ClaimStatus.Pending,
    }));

    const claimData = {
      category,
      amount: parseFloat(amount),
      date,
      description,
      invoiceNumber,
      approvers,
      mealTypes: mealTypes.length > 0 ? mealTypes : undefined,
      fromLocation: fromLocation || undefined,
      toLocation: toLocation || undefined,
      cabType: cabType || undefined,
      bookingApp: bookingApp || undefined,
      coPassengers: coPassengers || undefined,
      proofUrls: proofFiles.map(getFileUrl),
    };
    
    if (claimToEdit) {
      onSubmit({ ...claimToEdit, ...claimData });
    } else {
      onSubmit(claimData);
    }
  };

  const handleMealTypeChange = (meal: MealType) => {
    setMealTypes(prev => 
        prev.includes(meal) 
        ? prev.filter(m => m !== meal) 
        : [...prev, meal]
    );
  };
  
  const handleSelectApproverResult = (person: Employee) => {
    if (person.id === 'ADD_NEW') {
        const newApprover = { id: `new_${Date.now()}`, name: person.name };
        // Add to the main list for future searches in this session
        setAllEmployees(prev => [newApprover, ...prev]); 
        // Add to the selected list for this claim
        setSelectedApprovers(prev => [...prev, newApprover]);
    } else {
        setSelectedApprovers(prev => [...prev, person]);
    }
    setApproverSearch('');
    setApproverResults([]);
  };

  const removeApprover = (approverId: string) => {
    setSelectedApprovers(prev => prev.filter(a => a.id !== approverId));
  };

  const removeProofFile = (index: number) => {
    setProofFiles(prev => prev.filter((_, i) => i !== index));
  }
  
  const isAnalyzing = analysisStatus.type === 'analyzing';

  const renderCategorySpecificFields = () => {
    const commonLocationFields = (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="fromLocation" className="block text-sm font-medium text-slate-600">From</label>
                    <input type="text" id="fromLocation" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} placeholder="e.g., Office" className={inputStyles} />
                </div>
                <div>
                    <label htmlFor="toLocation" className="block text-sm font-medium text-slate-600">To</label>
                    <input type="text" id="toLocation" value={toLocation} onChange={(e) => setToLocation(e.target.value)} placeholder="e.g., Airport" className={inputStyles} />
                </div>
            </div>
        </>
    );

    switch (category) {
      case ClaimCategory.Food:
        return (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Meal Type (select all that apply)</label>
            <div className="flex flex-wrap gap-4">
              {Object.values(MealType).map((type) => (
                <label key={type} className="flex items-center">
                  <input type="checkbox" name="mealType" value={type} checked={mealTypes.includes(type)} onChange={() => handleMealTypeChange(type)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-slate-700">{type}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case ClaimCategory.Cab:
        return (
          <div className="space-y-4">
            {commonLocationFields}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="cabType" className="block text-sm font-medium text-slate-600">Cab Type</label>
                    <select id="cabType" value={cabType || ''} onChange={(e) => setCabType(e.target.value as CabType)} className={selectStyles}>
                        <option value="" disabled>Select type...</option>
                        {Object.values(CabType).map(ct => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="bookingApp" className="block text-sm font-medium text-slate-600">Booking App</label>
                    <select id="bookingApp" value={bookingApp || ''} onChange={(e) => setBookingApp(e.target.value as BookingApp)} className={selectStyles}>
                        <option value="" disabled>Select app...</option>
                        {Object.values(BookingApp).map(ba => <option key={ba} value={ba}>{ba}</option>)}
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="coPassengers" className="block text-sm font-medium text-slate-600">Co-passenger(s)</label>
                <input type="text" id="coPassengers" value={coPassengers} onChange={(e) => setCoPassengers(e.target.value)} placeholder="e.g., Name, Department" className={inputStyles} />
            </div>
          </div>
        );
      case ClaimCategory.Train:
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-500">Travel Details</h4>
            {commonLocationFields}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-600">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ClaimCategory)} className={selectStyles} disabled={isAnalyzing}>
            {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
        </div>
         <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-600">Amount</label>
          <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₹ 0.00" className={inputStyles} disabled={category === ClaimCategory.Food || isAnalyzing} />
        </div>
        <div>
            <label htmlFor="date" className="block text-sm font-medium text-slate-600">Date</label>
            <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputStyles} disabled={isAnalyzing} />
        </div>
      </div>

      <div>
          <label htmlFor="invoiceNumber" className="block text-sm font-medium text-slate-600">Invoice / OIF No.</label>
          <input type="text" id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} placeholder="e.g., INV-12345" className={inputStyles} />
      </div>

      {renderCategorySpecificFields() && <div className="border-t border-slate-200 pt-4">{renderCategorySpecificFields()}</div>}
      
      <div className="border-t border-slate-200 pt-4">
        <label className="block text-sm font-medium text-slate-600">Approving Manager(s)</label>
        <div className="mt-2 flex flex-wrap gap-2">
            {selectedApprovers.map(approver => (
                <div key={approver.id} className="flex items-center gap-2 bg-indigo-100 text-indigo-800 text-sm font-semibold px-2 py-1 rounded-full">
                    <span>{approver.name}</span>
                    <button type="button" onClick={() => removeApprover(approver.id)} className="text-indigo-500 hover:text-indigo-700">
                        <XIcon className="h-4 w-4" />
                    </button>
                </div>
            ))}
        </div>
        <div className="relative mt-2">
            <input 
                type="text" 
                value={approverSearch}
                onChange={e => setApproverSearch(e.target.value)}
                placeholder="Search for an approver..."
                className={inputStyles}
            />
            {approverResults.length > 0 && (
                <ul ref={searchResultsRef} className="absolute z-10 w-full bg-white border border-slate-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                    {approverResults.map(person => (
                        <li 
                            key={person.id} 
                            onClick={() => handleSelectApproverResult(person)}
                            className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                        >
                            {person.id === 'ADD_NEW' ? (
                                <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                                    <PlusIcon className="h-4 w-4" />
                                    <span>Add "{person.name}"</span>
                                </div>
                            ) : (
                                person.name
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
      
      <div className="border-t border-slate-200 pt-4">
        <label htmlFor="description" className="block text-sm font-medium text-slate-600">
          Notes / Description
          {isDescriptionOptional && <span className="text-slate-400 font-normal ml-1">(Optional)</span>}
        </label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="e.g., Team dinner with Acme Corp" className={`${inputStyles} resize-y`}></textarea>
      </div>

      <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2 mb-2">
              <SparklesIcon className="h-5 w-5 text-indigo-500" />
              <label className="block text-sm font-medium text-slate-600">
                  Upload Receipt(s) to Auto-fill
                  {isReceiptOptional && <span className="text-slate-400 font-normal ml-1">(Optional)</span>}
              </label>
          </div>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
              <div className="flex text-sm text-slate-600">
                <label htmlFor="proof-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload or take a photo</span>
                  <input id="proof-upload" name="proof-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,application/pdf" multiple capture="environment" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
            </div>
          </div>
           {analysisStatus.type !== 'idle' && (
              <div className={`mt-2 text-sm text-center p-2 rounded-md ${
                  analysisStatus.type === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                  analysisStatus.type === 'success' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
              }`}>
                  {analysisStatus.message}
              </div>
          )}
          {proofFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {proofFiles.map((file, index) => {
                     const isImage = (typeof file === 'string') || (file instanceof File && file.type.startsWith('image/'));
                     const isPdf = file instanceof File && file.type === 'application/pdf';

                     return (
                      <div key={index} className="relative group aspect-square bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-center p-2">
                          {isImage ? (
                            <img src={getFileUrl(file)} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                          ) : isPdf ? (
                            <div className="flex flex-col items-center gap-1 text-slate-500">
                                <DocumentIcon className="h-10 w-10" />
                                <p className="text-xs font-medium break-words w-full">{getFileName(file)}</p>
                            </div>
                          ) : null}

                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center gap-4 rounded-md">
                            <a href={getFileUrl(file)} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity text-white" aria-label="View file">
                                <EyeIcon className="h-6 w-6"/>
                            </a>
                            <a href={getFileUrl(file)} download={getFileName(file)} className="opacity-0 group-hover:opacity-100 transition-opacity text-white" aria-label="Download file">
                                <DownloadIcon className="h-6 w-6"/>
                            </a>
                            <button onClick={() => removeProofFile(index)} className="absolute top-1 right-1 h-6 w-6 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100" aria-label="Remove file">
                                <XIcon className="h-4 w-4 m-auto" />
                            </button>
                          </div>
                      </div>
                    );
                  })}
              </div>
          )}
        </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{error}</p>}
      
      <div className="flex items-center justify-end gap-4 pt-4 mt-4 border-t border-slate-200">
        <button 
          type="button" 
          onClick={onCancel}
          className="w-full sm:w-auto flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
        >
          {claimToEdit ? 'Save Changes' : 'Submit Claim'}
        </button>
      </div>
    </form>
  );
};

export default ClaimForm;