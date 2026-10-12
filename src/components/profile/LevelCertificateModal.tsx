import React from 'react';
import { Award, Star, X, CheckCircle2, Sparkles, Printer, ShieldCheck } from 'lucide-react';
import { ChildProfile } from '../../types';
import { getStandardBadgeInfo, getLevelTier } from '../../data/levels';
import { MASCOTS } from '../../data/avatars';
import { sound } from '../../utils/sound';

interface LevelCertificateModalProps {
  isOpen: boolean;
  profile: ChildProfile;
  onClose: () => void;
}

export const LevelCertificateModal: React.FC<LevelCertificateModalProps> = ({
  isOpen,
  profile,
  onClose,
}) => {
  if (!isOpen) return null;

  const currentMascot = MASCOTS.find((m) => m.id === profile.avatar.mascotId) || MASCOTS[0];
  const tier = getLevelTier(profile.level);
  const standardBadge = getStandardBadgeInfo(profile.activeLanguage, profile.level);
  const isZh = profile.activeLanguage === 'zh';

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-amber-300 relative p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        {/* Top Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full cursor-pointer transition-colors"
          title="Close / Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame */}
        <div className="border-4 border-double border-amber-500 rounded-2xl p-5 sm:p-8 bg-gradient-to-b from-amber-50/70 via-white to-orange-50/50 text-center relative overflow-hidden shadow-inner">
          {/* Corner Ornaments */}
          <div className="absolute top-2 left-2 text-amber-400 text-xl font-serif">✦</div>
          <div className="absolute top-2 right-2 text-amber-400 text-xl font-serif">✦</div>
          <div className="absolute bottom-2 left-2 text-amber-400 text-xl font-serif">✦</div>
          <div className="absolute bottom-2 right-2 text-amber-400 text-xl font-serif">✦</div>

          {/* Header Seal */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl sm:text-4xl shadow-md border-4 border-white">
            {tier.badgeEmoji}
          </div>

          <p className="text-[11px] font-black uppercase tracking-widest text-amber-700 mb-1">
            Certificate of Language Achievement • 荣誉证书
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            LinguaPlay Kids Junior Diplomat
          </h2>

          <p className="text-xs font-semibold text-gray-500 max-w-md mx-auto mb-4">
            This certifies that young language explorer
          </p>

          {/* Child Name Banner */}
          <div className="inline-block px-6 py-2 bg-amber-100 border-b-4 border-amber-400 rounded-2xl mb-4">
            <span className="text-2xl sm:text-3xl font-black text-amber-950 flex items-center gap-2 justify-center">
              <span>{currentMascot.emoji}</span>
              <span>{profile.nickname}</span>
            </span>
          </div>

          <p className="text-xs font-semibold text-gray-600 mb-2">
            has demonstrated recognized junior language proficiency in{' '}
            <span className="font-black text-gray-900">{isZh ? 'Mandarin Chinese (中文)' : 'English (英语)'}</span>:
          </p>

          {/* Level Standard Accreditation Box */}
          <div className="bg-white/90 border-2 border-amber-300 rounded-2xl p-4 max-w-lg mx-auto shadow-sm mb-5 text-left flex items-start gap-3">
            <div className="p-3 bg-amber-500 text-white rounded-xl shadow-xs shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-black uppercase text-amber-800">
                  {standardBadge.frameworkName}
                </span>
                <span className="bg-amber-100 text-amber-900 text-xs font-extrabold px-2 py-0.5 rounded-md border border-amber-300">
                  {standardBadge.standardCode}
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2 py-0.5 rounded-md border border-emerald-300">
                  Level {tier.level} • {tier.titleEn}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-600 leading-relaxed">
                {isZh ? tier.descriptionZh : tier.descriptionEn}
              </p>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left mb-6 max-w-lg mx-auto">
            {(isZh ? tier.skillsZh : tier.skillsEn).map((skill, idx) => (
              <div key={idx} className="bg-amber-50/80 border border-amber-200 rounded-xl p-2 text-[10px] font-bold text-amber-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{skill}</span>
              </div>
            ))}
          </div>

          {/* Bottom Accreditation Badges & Signoff */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-amber-200 text-left text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="font-extrabold text-gray-900 leading-tight">Verified Standard</p>
                <p className="text-[10px] text-gray-500 font-medium">CEFR & YCT Guidelines</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-black text-amber-900 text-sm">{profile.stars} ⭐ Stars Earned</p>
              <p className="text-[10px] text-gray-400 font-bold">LinguaPlay Kids Learning Academy</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold text-xs rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Diploma</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            Awesome! Keep Learning
          </button>
        </div>
      </div>
    </div>
  );
};
