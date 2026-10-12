import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10 sm:w-11 sm:h-11',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-3xl sm:text-4xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Transparent Mascot Vector Icon (No square background) */}
      <svg
        viewBox="0 0 64 64"
        className={`${iconSizes[size]} shrink-0 transition-transform hover:scale-105 duration-200`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="logoBookCover" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="logoBookPages" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* Radiant Sparkles */}
        <line x1="12" y1="20" x2="6" y2="18" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="15" y1="13" x2="11" y2="8" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="32" y1="8" x2="32" y2="2" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="49" y1="13" x2="53" y2="8" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="52" y1="20" x2="58" y2="18" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />

        {/* Star Mascot Body */}
        <path
          d="M 32 6 
             C 33.5 10, 36 15, 39 17 
             C 43 18, 51 18, 53 20 
             C 54 22, 51 28, 48 31 
             C 47 34, 49 41, 47 43 
             C 45 44, 38 41, 35 41 
             C 33 42, 29 42, 27 41 
             C 24 41, 17 44, 15 43 
             C 13 41, 15 34, 14 31 
             C 11 28, 8 22, 9 20 
             C 11 18, 19 18, 23 17 
             C 26 15, 28.5 10, 32 6 Z"
          fill="url(#logoStarGrad)"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Eyes */}
        <circle cx="26" cy="25" r="2.2" fill="#1e293b" />
        <circle cx="25.3" cy="24.3" r="0.7" fill="#ffffff" />
        <circle cx="38" cy="25" r="2.2" fill="#1e293b" />
        <circle cx="37.3" cy="24.3" r="0.7" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx="21" cy="28" rx="2.5" ry="1.5" fill="#f87171" opacity="0.6" />
        <ellipse cx="43" cy="28" rx="2.5" ry="1.5" fill="#f87171" opacity="0.6" />

        {/* Smile */}
        <path d="M 29.5 28 Q 32 32 34.5 28" fill="#1e293b" stroke="#1e293b" strokeWidth="1" strokeLinecap="round" />

        {/* Open Purple Book */}
        <path d="M 32 40 L 14 34 L 12 48 L 32 55 Z" fill="url(#logoBookCover)" stroke="#4338ca" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 32 40 L 50 34 L 52 48 L 32 55 Z" fill="url(#logoBookCover)" stroke="#4338ca" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M 32 39 L 15 33 L 13.5 46.5 L 32 53.5 Z" fill="url(#logoBookPages)" />
        <path d="M 32 39 L 49 33 L 50.5 46.5 L 32 53.5 Z" fill="url(#logoBookPages)" />
        <line x1="32" y1="39" x2="32" y2="55" stroke="#4338ca" strokeWidth="1.5" />

        {/* Little Hands */}
        <circle cx="15" cy="40" r="2.5" fill="#facc15" stroke="#d97706" strokeWidth="0.8" />
        <circle cx="49" cy="40" r="2.5" fill="#facc15" stroke="#d97706" strokeWidth="0.8" />
      </svg>

      {/* Styled Brand Typography (No background, crisp & clean) */}
      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center leading-none">
            <span className={`font-black tracking-tight text-slate-900 ${textSizes[size]}`}>
              L
              <span className="relative inline-block">
                i
                {/* Heart dot over the 'i' */}
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] text-orange-500 font-bold leading-none">
                  ♥
                </span>
              </span>
              ngua
            </span>
            <span className={`font-black tracking-tight text-amber-500 ml-0.5 ${textSizes[size]}`}>
              Play
            </span>
            <span className="ml-1 px-1.5 py-0.5 rounded-lg bg-orange-100 text-orange-700 font-black text-[9px] sm:text-[10px] uppercase tracking-wider">
              Kids
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 tracking-wider uppercase mt-0.5">
            Learn Languages By Playing
          </span>
        </div>
      )}
    </div>
  );
};
