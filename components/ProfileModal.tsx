import React from 'react';
import Modal from './Modal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="py-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-lg text-slate-800">{value}</p>
    </div>
);

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="My Profile">
      <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
        <img 
            className="h-16 w-16 rounded-full object-cover ring-2 ring-offset-2 ring-indigo-400"
            src={`https://api.dicebear.com/8.x/initials/svg?seed=Jane%20Smith`}
            alt="User Profile"
        />
        <div>
            <h3 className="text-2xl font-bold text-slate-800">Jane Smith</h3>
            <p className="text-slate-500">Engineering Manager</p>
        </div>
      </div>
      <div className="mt-4 divide-y divide-slate-200">
        <DetailRow label="Employee ID" value="54321" />
        <DetailRow label="Email" value="jane.smith@faceprep.com" />
        <DetailRow label="Department" value="Technology" />
        <DetailRow label="Reporting Manager" value="John Doe" />
      </div>
       <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-slate-200">
            <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
                Close
            </button>
        </div>
    </Modal>
  );
};

export default ProfileModal;