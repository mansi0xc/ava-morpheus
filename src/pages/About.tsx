import React from 'react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateFrame } from '@/components/steampunk/OrnateFrame';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import { Cog, Clock, Compass, Wrench } from 'lucide-react';
import steampunkBg from '@/assets/steampunk-bg.jpg';

export const About: React.FC = () => {
  return (
    <div 
      className="min-h-screen steampunk-bg"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${steampunkBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <SteampunkNavbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-foreground glow-text mb-6">
              ABOUT THE REALM
            </h1>
            <p className="font-ornate text-xl text-muted-foreground">
              Discover the intricate world of clockwork engineering and steam-powered innovation
            </p>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-40 left-20 text-8xl font-steampunk text-primary/10 animate-glow-pulse">
              ⚙
            </div>
            <div className="absolute top-60 right-32 text-6xl font-steampunk text-primary/15 animate-glow-pulse">
              XII
            </div>
            <div className="absolute bottom-40 left-40 text-7xl font-steampunk text-primary/10 animate-glow-pulse">
              III
            </div>
            <GearSpinner size="xl" className="absolute top-32 right-16 opacity-10 w-24 h-24" />
            <GearSpinner size="lg" reverse className="absolute bottom-32 left-16 opacity-15 w-20 h-20" />
          </div>

          {/* Main Content */}
          <div className="space-y-12 relative z-10">
            {/* Introduction Section */}
            <OrnateFrame variant="glowing" className="animate-ornate-entrance">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <Cog className="w-16 h-16 text-primary animate-gear-rotate" />
                    <Clock className="absolute inset-0 w-8 h-8 m-4 text-primary animate-gear-rotate-reverse" />
                  </div>
                </div>
                <h2 className="font-steampunk text-3xl font-bold text-foreground glow-text mb-6">
                  WELCOME TO THE AVALANCHE REALM
                </h2>
                <p className="font-ornate text-lg text-foreground leading-relaxed">
                  In an age where steam rises and gears turn with mechanical precision, the Avalanche Steampunk Gaming Portal 
                  stands as a testament to the fusion of Victorian elegance and modern gaming innovation. Here, brass meets 
                  algorithms, and clockwork dances with code.
                </p>
              </div>
            </OrnateFrame>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <OrnateFrame 
                variant="elevated" 
                className="animate-ornate-entrance" 
                style={{ animationDelay: '0.2s' }}
              >
                <div className="text-center">
                  <Compass className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-steampunk text-xl font-bold text-foreground glow-text mb-4">
                    PRECISION ENGINEERING
                  </h3>
                  <p className="font-ornate text-muted-foreground">
                    Every gear, every pipe, every ornamental frame has been crafted with meticulous attention to detail. 
                    Our mechanical aesthetics serve both form and function.
                  </p>
                </div>
              </OrnateFrame>

              <OrnateFrame 
                variant="elevated" 
                className="animate-ornate-entrance" 
                style={{ animationDelay: '0.4s' }}
              >
                <div className="text-center">
                  <Wrench className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="font-steampunk text-xl font-bold text-foreground glow-text mb-4">
                    AVALANCHE INNOVATION
                  </h3>
                  <p className="font-ornate text-muted-foreground">
                    Built upon the Avalanche foundation, our portal combines the speed and efficiency of modern blockchain 
                    technology with the timeless appeal of steampunk design.
                  </p>
                </div>
              </OrnateFrame>
            </div>

            {/* Philosophy Section */}
            <OrnateFrame 
              variant="glowing" 
              className="animate-ornate-entrance" 
              style={{ animationDelay: '0.6s' }}
            >
              <h2 className="font-steampunk text-2xl font-bold text-foreground glow-text mb-6 text-center">
                OUR PHILOSOPHY
              </h2>
              <div className="space-y-4">
                <p className="font-ornate text-foreground leading-relaxed">
                  <span className="text-primary font-bold">Mechanical Mastery:</span> Every element serves a purpose, 
                  from the rotating gears that signify active processes to the ornate frames that house our most precious content.
                </p>
                <p className="font-ornate text-foreground leading-relaxed">
                  <span className="text-primary font-bold">Steam-Powered Innovation:</span> We believe that progress doesn't 
                  require abandoning the elegance of the past. Our designs honor the industrial revolution while embracing 
                  digital transformation.
                </p>
                <p className="font-ornate text-foreground leading-relaxed">
                  <span className="text-primary font-bold">Avalanche Excellence:</span> With the reliability and speed of 
                  Avalanche's red, black, and white identity, we've created a portal that's both visually stunning and 
                  functionally superior.
                </p>
              </div>
            </OrnateFrame>

            {/* Technical Specifications */}
            <OrnateFrame 
              variant="default" 
              className="animate-ornate-entrance" 
              style={{ animationDelay: '0.8s' }}
            >
              <h2 className="font-steampunk text-2xl font-bold text-foreground glow-text mb-6 text-center">
                TECHNICAL SPECIFICATIONS
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-steampunk text-primary glow-text mb-2">∞</div>
                  <p className="font-ornate text-sm text-muted-foreground">Infinite Possibilities</p>
                </div>
                <div>
                  <div className="text-3xl font-steampunk text-primary glow-text mb-2">⚡</div>
                  <p className="font-ornate text-sm text-muted-foreground">Lightning Speed</p>
                </div>
                <div>
                  <div className="text-3xl font-steampunk text-primary glow-text mb-2">🔒</div>
                  <p className="font-ornate text-sm text-muted-foreground">Secure Engineering</p>
                </div>
              </div>
            </OrnateFrame>

            {/* Closing Statement */}
            <div className="text-center">
              <blockquote className="font-ornate text-lg text-muted-foreground italic border-l-4 border-primary pl-6 max-w-2xl mx-auto">
                "In the marriage of steam and code, we find not just entertainment, but artistry. 
                Welcome to a realm where every click is a gear turning, every interaction a mechanical symphony."
              </blockquote>
              <p className="font-steampunk text-primary glow-text mt-4">— The Master Engineers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;