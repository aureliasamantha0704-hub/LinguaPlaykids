import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'icon';
  className?: string;
  height?: number | string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  className = '',
  height = 42,
}) => {
  if (variant === 'icon') {
    return (
      <img
        src="/favicon.svg"
        alt="LinguaPlay Star Mascot"
        style={{ height }}
        className={`inline-block object-contain select-none ${className}`}
        loading="eager"
      />
    );
  }

  return (
    <img
      src="/logo.svg"
      alt="LinguaPlay Kids Logo"
      style={{ height }}
      className={`inline-block object-contain select-none max-w-full ${className}`}
      loading="eager"
    />
  );
};
