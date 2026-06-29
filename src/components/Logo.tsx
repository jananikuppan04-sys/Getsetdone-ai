import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const LogoIcon: React.FC<LogoProps> = ({ className = '', size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-indigo-500 hover:text-indigo-400 transition-colors ${className}`}
      aria-hidden="true"
    >
      {/* Rounded Square Calendar Frame */}
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      
      {/* Calendar Binder Rings/Bars */}
      <path
        d="M16 2V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 2V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Calendar Horizontal Separator Line */}
      <path
        d="M3 10H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Sharp/Clean Checkmark inside lower area */}
      <path
        d="M8.5 14.5L11 17L16 12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const LogoWithWordmark: React.FC<{
  className?: string;
  iconSize?: number;
  wordmarkClassName?: string;
  taglineClassName?: string;
  onClick?: () => void;
}> = ({
  className = 'flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-all select-none',
  iconSize = 28,
  wordmarkClassName = 'font-bold text-sm text-white tracking-tight',
  taglineClassName = 'text-[9px] text-slate-500 font-medium',
  onClick
}) => {
  return (
    <div className={className} onClick={onClick} id="brand-logo">
      <LogoIcon size={iconSize} />
      <div>
        <span className={wordmarkClassName}>GetSetDone</span>
        <p className={taglineClassName}>Less panic. More progress.</p>
      </div>
    </div>
  );
};
