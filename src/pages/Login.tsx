import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrnateFrame } from '@/components/steampunk/OrnateFrame';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import steampunkBg from '@/assets/steampunk-bg.jpg';

export const Login: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/catalog');
          }, 1000);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${steampunkBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Gears and Roman Numerals */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large Clock Face Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 md:w-[500px] md:h-[500px] rounded-full border-4 border-primary/20 flex items-center justify-center">
            {/* Roman numerals around the clock */}
            {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((numeral, index) => (
              <div
                key={numeral}
                className="absolute font-steampunk text-2xl md:text-3xl text-primary/40 glow-text"
                style={{
                  transform: `rotate(${index * 30}deg) translateY(-180px) rotate(-${index * 30}deg)`,
                }}
              >
                {numeral}
              </div>
            ))}
          </div>
        </div>

        {/* Floating Gears */}
        <GearSpinner 
          size="xl" 
          className="absolute top-16 left-16 opacity-30 w-20 h-20" 
        />
        <GearSpinner 
          size="lg" 
          reverse 
          className="absolute top-32 right-20 opacity-25 w-16 h-16" 
        />
        <GearSpinner 
          size="md" 
          className="absolute bottom-32 left-32 opacity-35 w-12 h-12" 
        />
        <GearSpinner 
          size="lg" 
          reverse 
          className="absolute bottom-16 right-16 opacity-30 w-18 h-18" 
        />
      </div>

      {/* Main Login Frame */}
      <div className="relative z-10 w-full max-w-md animate-ornate-entrance">
        <OrnateFrame variant="glowing" className="text-center">
          {/* Title */}
          <h2 className="font-steampunk text-3xl font-bold text-foreground glow-text mb-8">
            CHECKING LOGIN INFORMATION
          </h2>

          {/* Central Gear Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <GearSpinner size="xl" className="w-16 h-16 text-primary" />
              <div className="absolute inset-0 flex items-center justify-center">
                <GearSpinner size="md" reverse className="w-8 h-8 text-primary opacity-70" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-surface-elevated rounded-full h-4 border-2 border-primary/50 overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-300 relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                {/* Glowing effect on progress bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-between items-center">
            {/* 0% Indicator */}
            <div className="relative">
              <div className="w-16 h-16 bg-surface border-2 border-primary transform rotate-45 flex items-center justify-center shadow-glow">
                <span className="font-steampunk text-sm font-bold text-primary transform -rotate-45 glow-text">
                  0%
                </span>
              </div>
            </div>

            {/* Current Progress Indicator */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-primary border-2 border-primary transform rotate-45 flex items-center justify-center shadow-glow animate-border-glow">
                <span className="font-steampunk text-lg font-bold text-primary-foreground transform -rotate-45">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* 100% Indicator */}
            <div className="relative">
              <div className={`w-16 h-16 border-2 transform rotate-45 flex items-center justify-center transition-all duration-500 ${
                progress >= 100 
                  ? 'bg-gradient-primary border-primary shadow-glow animate-border-glow' 
                  : 'bg-surface border-primary/50'
              }`}>
                <span className={`font-steampunk text-sm font-bold transform -rotate-45 transition-colors ${
                  progress >= 100 ? 'text-primary-foreground' : 'text-primary/50'
                }`}>
                  100%
                </span>
              </div>
            </div>
          </div>

          {/* Status Text */}
          <div className="mt-8">
            <p className="font-ornate text-sm text-muted-foreground">
              {progress < 30 && "Initializing clockwork mechanisms..."}
              {progress >= 30 && progress < 60 && "Calibrating steam pressure..."}
              {progress >= 60 && progress < 90 && "Synchronizing gear ratios..."}
              {progress >= 90 && progress < 100 && "Finalizing authentication..."}
              {progress >= 100 && "Access granted! Welcome, Engineer."}
            </p>
          </div>
        </OrnateFrame>
      </div>

      {/* Steam Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-12 bg-gradient-to-t from-primary/30 to-transparent rounded-full opacity-60"
            style={{
              left: `${10 + i * 12}%`,
              bottom: '5%',
              animation: `float ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scaleY(1); }
          50% { transform: translateY(-15px) scaleY(1.1); }
        }
      `}</style>
    </div>
  );
};

export default Login;