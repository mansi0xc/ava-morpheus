import React from 'react';
import { cn } from '@/lib/utils';

interface GearSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  reverse?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

export const GearSpinner: React.FC<GearSpinnerProps> = ({ 
  size = 'md', 
  reverse = false,
  className 
}) => {
  return (
    <div 
      className={cn(
        sizeMap[size],
        reverse ? 'animate-gear-rotate-reverse' : 'animate-gear-rotate',
        'border-2 border-primary rounded-full flex items-center justify-center relative',
        className
      )}
    >
      {/* Outer gear teeth */}
      <div className="absolute inset-0 rounded-full border-2 border-primary">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-primary"
            style={{
              top: '-6px',
              left: '50%',
              transform: `translateX(-50%) rotate(${i * 45}deg)`,
              transformOrigin: '50% calc(100% + 6px)'
            }}
          />
        ))}
      </div>
      
      {/* Inner gear */}
      <div className="w-3/4 h-3/4 border border-primary rounded-full flex items-center justify-center">
        <div className="w-1/2 h-1/2 border border-primary rounded-full" />
      </div>
    </div>
  );
};