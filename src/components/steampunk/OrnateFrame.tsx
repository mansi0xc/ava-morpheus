import React from 'react';
import { cn } from '@/lib/utils';

interface OrnateFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glowing';
  style?: React.CSSProperties;
}

export const OrnateFrame: React.FC<OrnateFrameProps> = ({ 
  children, 
  className,
  variant = 'default',
  style
}) => {
  const baseClasses = "relative p-8 rounded-ornate border-2 border-primary bg-surface";
  
  const variantClasses = {
    default: "shadow-ornate",
    elevated: "shadow-glow transform hover:scale-[1.02] transition-transform",
    glowing: "shadow-glow animate-border-glow"
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} style={style}>
      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-ornate opacity-20 rounded-ornate" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};