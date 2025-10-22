import React, { useState } from 'react';
import { ClaimCategory, ClaimStatus } from '../types';
import FilterIcon from './icons/FilterIcon';
import XIcon from './icons/XIcon';
import SearchIcon from './icons/SearchIcon';

interface FilterBarProps {
  onFilterChange: (filters: { category: string; status: string }) => void;
  onSortChange: (sortKey: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, onSortChange, searchQuery, onSearchChange }) => {
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    onFilterChange({ category: newCategory, status });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onFilterChange({ category, status: newStatus });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    onSortChange(newSortBy);
  };
  
  const selectStyles = "w-full text-sm border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white";
  
  const filtersContent = (
    <>
      <div className="relative flex-grow md:flex-grow-0">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="h-4 w-4 text-slate-400" />
        </span>
        <input
          type="text"
          placeholder="Search claims..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white"
        />
      </div>
      <div>
        <label htmlFor="sort-by" className="sr-only">Sort by</label>
        <select id="sort-by" value={sortBy} onChange={handleSortChange} className={selectStyles}>
            <option value="date-desc">Sort: Date Newest</option>
            <option value="date-asc">Sort: Date Oldest</option>
            <option value="amount-desc">Sort: Amount High-Low</option>
            <option value="amount-asc">Sort: Amount Low-High</option>
        </select>
      </div>
      <div>
        <label htmlFor="category-filter" className="sr-only">Filter by category</label>
        <select id="category-filter" value={category} onChange={handleCategoryChange} className={selectStyles}>
          <option value="All">All Categories</option>
          {Object.values(ClaimCategory).map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="status-filter" className="sr-only">Filter by status</label>
        <select id="status-filter" value={status} onChange={handleStatusChange} className={selectStyles}>
          <option value="All">All Statuses</option>
          {Object.values(ClaimStatus).map(stat => (
            <option key={stat} value={stat}>{stat}</option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <div className="flex-grow md:flex-grow-0">
        <div className="md:hidden">
            <button onClick={() => setShowFilters(!showFilters)} className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-white text-slate-700 font-semibold rounded-lg shadow-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                <FilterIcon className="h-5 w-5" />
                <span>Filter & Sort</span>
            </button>
        </div>
        {/* Mobile Filters Modal */}
        {showFilters && (
            <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setShowFilters(false)}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-72 bg-white rounded-lg shadow-xl p-4 border border-slate-200" onClick={e => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold">Filter & Sort</h4>
                        <button onClick={() => setShowFilters(false)}><XIcon className="h-5 w-5"/></button>
                    </div>
                    <div className="space-y-4">
                        {filtersContent}
                    </div>
                </div>
            </div>
        )}
        {/* Desktop Filters */}
        <div className="hidden md:flex md:items-center md:gap-2">
            {filtersContent}
        </div>
    </div>
  );
};

export default FilterBar;