import React from 'react';
import { LogOut, X, AlertCircle } from 'lucide-react';
import { sound } from '../../utils/sound';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-300 relative text-center animate-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-black text-xl p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
          title="Close / Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 bg-rose-100 border-2 border-rose-300 rounded-2xl mx-auto mb-4 flex items-center justify-center text-rose-600 shadow-sm">
          <LogOut className="w-8 h-8 stroke-[2.5]" />
        </div>

        <h3 className="text-2xl font-black text-gray-900 mb-2">
          Log Out / Keluar
        </h3>

        <p className="text-sm font-extrabold text-gray-700 mb-1">
          Are you sure you want to log out?
        </p>
        <p className="text-xs text-gray-500 font-semibold mb-6">
          Your English & Mandarin learning progress is safely saved on this device.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-sm rounded-2xl border-2 border-gray-300 cursor-pointer active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onConfirmLogout();
            }}
            className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm rounded-2xl shadow-md border-2 border-rose-600 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4 stroke-[2.5]" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
