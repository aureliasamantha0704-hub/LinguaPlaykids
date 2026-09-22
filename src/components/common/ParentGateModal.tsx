import React, { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle2, X } from 'lucide-react';
import { sound } from '../../utils/sound';

interface ParentGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentGateModal: React.FC<ParentGateModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [num1, setNum1] = useState(6);
  const [num2, setNum2] = useState(7);
  const [inputAnswer, setInputAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const n1 = Math.floor(Math.random() * 8) + 5; // 5 to 12
      const n2 = Math.floor(Math.random() * 8) + 4; // 4 to 11
      setNum1(n1);
      setNum2(n2);
      setInputAnswer('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = num1 + num2;
    if (parseInt(inputAnswer.trim(), 10) === expected) {
      sound.playCorrect();
      onSuccess();
      onClose();
    } else {
      sound.playWrong();
      setErrorMsg('Incorrect answer. Please try again.');
      setInputAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-purple-300 relative text-center animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-purple-100 rounded-3xl mx-auto mb-4 flex items-center justify-center text-purple-600 border-2 border-purple-200 shadow-inner">
          <Shield className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-black text-purple-900 mb-1">Grown-Ups Only</h3>
        <p className="text-sm text-gray-600 mb-6 font-medium">
          Please solve this math question to enter the Parent Dashboard:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-2xl border-2 border-purple-200 flex items-center justify-center gap-3 text-3xl font-black text-purple-900">
            <span>{num1}</span>
            <span>+</span>
            <span>{num2}</span>
            <span>=</span>
            <input
              type="number"
              value={inputAnswer}
              onChange={(e) => setInputAnswer(e.target.value)}
              placeholder="?"
              autoFocus
              className="w-20 py-1 text-center bg-white border-2 border-purple-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-300 text-purple-900 font-black shadow-inner"
            />
          </div>

          {errorMsg && <p className="text-xs font-bold text-rose-500 animate-shake">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-lg border-2 border-purple-400 cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            <span>Enter Parent Dashboard</span>
          </button>
        </form>
      </div>
    </div>
  );
};
