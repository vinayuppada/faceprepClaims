import React from 'react';
import ViewListIcon from './icons/ViewListIcon';
import ViewGridIcon from './icons/ViewGridIcon';

interface ViewToggleProps {
    view: 'list' | 'grid';
    onViewChange: (view: 'list' | 'grid') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
    const baseClass = "p-2 rounded-md transition-colors";
    const activeClass = "bg-indigo-600 text-white shadow-inner";
    const inactiveClass = "text-slate-500 hover:bg-slate-200";

    return (
        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
                onClick={() => onViewChange('list')}
                className={`${baseClass} ${view === 'list' ? activeClass : inactiveClass}`}
                aria-label="List view"
                title="List view"
            >
                <ViewListIcon className="h-5 w-5" />
            </button>
            <button
                onClick={() => onViewChange('grid')}
                className={`${baseClass} ${view === 'grid' ? activeClass : inactiveClass}`}
                aria-label="Grid view"
                title="Grid view"
            >
                <ViewGridIcon className="h-5 w-5" />
            </button>
        </div>
    );
};

export default ViewToggle;
