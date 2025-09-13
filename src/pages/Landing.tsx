import React from 'react';
import { Link } from 'react-router-dom';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import gearOrnament from '@/assets/gear-ornament.png';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Animated Background Gears */}
      <div className="absolute inset-0 overflow-hidden">
        <GearSpinner 
          size="xl" 
          className="absolute top-20 left-20 opacity-20 w-32 h-32" 
        />
        <GearSpinner 
          size="lg" 
          reverse 
          className="absolute top-40 right-32 opacity-15 w-24 h-24" 
        />
        <GearSpinner 
          size="md" 
          className="absolute bottom-32 left-40 opacity-25 w-16 h-16" 
        />
        <GearSpinner 
          size="lg" 
          reverse 
          className="absolute bottom-20 right-20 opacity-20 w-28 h-28" 
        />
      </div>

      {/* Roman Numerals Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/4 text-6xl font-steampunk text-primary/30 animate-glow-pulse">
          XII
        </div>
        <div className="absolute top-1/4 right-10 text-4xl font-steampunk text-primary/25 animate-glow-pulse">
          III
        </div>
        <div className="absolute bottom-1/4 left-10 text-5xl font-steampunk text-primary/30 animate-glow-pulse">
          VI
        </div>
        <div className="absolute bottom-10 right-1/4 text-4xl font-steampunk text-primary/25 animate-glow-pulse">
          IX
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        {/* Logo/Title Section */}
        <div className="mb-12 animate-ornate-entrance">
          <div className="relative inline-block">
            {/* Ornate Frame for Title */}
            <div className="relative p-8 border-4 border-primary rounded-ornate bg-surface/90 shadow-glow backdrop-blur-sm">
              {/* Corner Decorations */}
              <div className="absolute -top-2 -left-2">
                <img 
                  src={gearOrnament} 
                  alt="gear decoration" 
                  className="w-8 h-8 opacity-60 animate-gear-rotate"
                />
              </div>
              <div className="absolute -top-2 -right-2">
                <img 
                  src={gearOrnament} 
                  alt="gear decoration" 
                  className="w-8 h-8 opacity-60 animate-gear-rotate-reverse"
                />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <img 
                  src={gearOrnament} 
                  alt="gear decoration" 
                  className="w-8 h-8 opacity-60 animate-gear-rotate-reverse"
                />
              </div>
              <div className="absolute -bottom-2 -right-2">
                <img 
                  src={gearOrnament} 
                  alt="gear decoration" 
                  className="w-8 h-8 opacity-60 animate-gear-rotate"
                />
              </div>

              {/* Title Text */}
              <h1 className="font-steampunk text-6xl md:text-8xl font-bold text-foreground glow-text mb-4">
                AVALANCHE
              </h1>
              <p className="font-ornate text-xl md:text-2xl text-primary glow-text">
                STEAMPUNK GAMING PORTAL
              </p>
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <div className="mb-12 animate-ornate-entrance" style={{ animationDelay: '0.3s' }}>
          <p className="font-ornate text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Enter a world of mechanical mysteries, ornate puzzles, and clockwork adventures. 
            Where gears turn and steam rises, your journey begins.
          </p>
        </div>

        {/* Enter Button */}
        <div className="animate-ornate-entrance" style={{ animationDelay: '0.6s' }}>
          <Link to="/catalog">
            <OrnateButton 
              variant="hero" 
              size="xl"
              className="relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <GearSpinner size="sm" className="group-hover:animate-gear-rotate-reverse" />
                <span>ENTER THE REALM</span>
                <GearSpinner size="sm" reverse className="group-hover:animate-gear-rotate" />
              </span>
            </OrnateButton>
          </Link>
        </div>

        {/* Atmospheric Quote */}
        <div className="mt-16 animate-ornate-entrance" style={{ animationDelay: '0.9s' }}>
          <blockquote className="font-ornate text-sm text-muted-foreground italic border-l-2 border-primary pl-4 max-w-md mx-auto">
            "In the symphony of gears and steam, legends are forged and mysteries unveiled."
          </blockquote>
        </div>
      </div>

      {/* Floating Steam Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-20 bg-gradient-to-t from-primary/20 to-transparent rounded-full opacity-60"
            style={{
              left: `${20 + i * 15}%`,
              bottom: '10%',
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Landing;