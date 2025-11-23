import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  text?: string;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  showText = true,
  text = 'BuildViz',
  className = ''
}) => {
  const iconSize = {
    small: 'w-5 h-5',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  const padding = {
    small: 'p-1',
    medium: 'p-1.5',
    large: 'p-2'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`bg-blue-600 text-white ${padding[size]} rounded-lg`}>
        <svg
          className={iconSize[size]}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      </div>
      {showText && (
        <span className={`font-semibold text-gray-700 ${
          size === 'small' ? 'text-lg' : size === 'large' ? 'text-2xl' : 'text-xl'
        }`}>
          {text}
        </span>
      )}
    </div>
  );
};
