import React from 'react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateFrame } from '@/components/steampunk/OrnateFrame';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import { Compass, Share2, Zap, BookOpen, Users2, Gamepad2 } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <SteampunkNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-foreground glow-text mb-6">WHY CASUAL MINI GAMES ON AVALANCHE</h1>
            <p className="font-ornate text-xl text-muted-foreground max-w-3xl mx-auto">Broadening Web3 gaming from niche, high-barrier experiences to daily, delightful, low-friction play.</p>
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <GearSpinner size="xl" className="absolute top-32 right-16 opacity-10 w-24 h-24" />
            <GearSpinner size="lg" reverse className="absolute bottom-32 left-16 opacity-15 w-20 h-20" />
            <div className="absolute top-60 left-24 text-7xl font-steampunk text-primary/10 animate-glow-pulse">⚙</div>
          </div>

          <div className="space-y-14 relative z-10">
            <OrnateFrame variant="glowing" className="animate-ornate-entrance">
              <h2 className="font-steampunk text-3xl font-bold text-foreground glow-text mb-4 text-center">The Narrow State of Web3 Gaming</h2>
              <div className="space-y-5 font-ornate text-foreground leading-relaxed">
                <p>Across Avalanche and broader Web3 ecosystems, the majority of playable titles concentrate on <span className="text-primary font-semibold">high-investment genres</span>: FPS, RPG, strategy battlers, racing, and play‑to‑earn loops. They innovate in tokenomics, asset ownership, and governance—but often at the cost of <span className="text-primary/80">approachability</span>.</p>
                <p>Flagship examples—Shrapnel, Monsterra, Portal Fantasy, Crabada—demonstrate technical ambition yet reinforce a landscape optimized for crypto‑native, time‑rich players. Entire genres like <span className="italic">casual puzzles, word games, daily brain teasers, deduction mysteries</span> are conspicuously underrepresented.</p>
                <p>The result: a perception that Web3 gaming = commitment, speculation, and complexity—rather than spontaneous fun.</p>
              </div>
            </OrnateFrame>

            <OrnateFrame variant="elevated" className="animate-ornate-entrance" style={{ animationDelay: '0.15s' }}>
              <h2 className="font-steampunk text-2xl font-bold text-foreground glow-text mb-6 text-center">Why Casual Mini Games Matter</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Gamepad2 className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-steampunk text-lg text-foreground">Accessibility</h4>
                      <p className="font-ornate text-sm text-muted-foreground">Zero steep onboarding; familiar mechanics (Wordle, Sudoku) let non‑crypto users participate instantly.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Zap className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-steampunk text-lg text-foreground">Daily Habit Loops</h4>
                      <p className="font-ornate text-sm text-muted-foreground">Short repeatable sessions drive retention and consistent wallet engagement.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Share2 className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-steampunk text-lg text-foreground">Organic Virality</h4>
                      <p className="font-ornate text-sm text-muted-foreground">Result sharing (e.g. emoji grids, streaks) catalyzes peer‑to‑peer growth sans paid acquisition.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users2 className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-steampunk text-lg text-foreground">Inclusive Audience</h4>
                      <p className="font-ornate text-sm text-muted-foreground">Welcomes classrooms, commuters & casuals—not just speculative power users.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-steampunk text-lg text-foreground">Low‑Friction Education</h4>
                      <p className="font-ornate text-sm text-muted-foreground">Subtly introduces wallets, signing, provenance, token utility through play.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Compass className="w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-steampunk text-lg text-foreground">Genre Expansion</h4>
                      <p className="font-ornate text-sm text-muted-foreground">Balances the ecosystem—beyond P2E grind loops toward expressive micro‑challenge design.</p>
                    </div>
                  </div>
                </div>
              </div>
            </OrnateFrame>

            <OrnateFrame variant="glowing" className="animate-ornate-entrance" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-steampunk text-2xl font-bold text-foreground glow-text mb-4 text-center">Our Approach</h2>
              <div className="space-y-4 font-ornate text-foreground leading-relaxed">
                <p>We fuse <span className="text-primary font-semibold">steampunk narrative framing</span> with proven casual puzzle formats. Each micro‑game acts as a delivery vector for both <span className="text-primary/80">entertainment</span> and <span className="text-primary/80">progressive blockchain literacy</span>.</p>
                <p>Clue unlocking (progress-based + purchasable) simulates discovery economics. Powerups model utility assets without overwhelming players in token mechanics.</p>
                <p>Design priorities: <span className="text-primary">speed to first interaction</span>, <span className="text-primary">shareable outcomes</span>, <span className="text-primary">transparent progression</span>, and <span className="text-primary">future extensibility</span> (open puzzles, community packs, seasonal arcs).</p>
              </div>
            </OrnateFrame>

            <OrnateFrame variant="default" className="animate-ornate-entrance" style={{ animationDelay: '0.45s' }}>
              <h2 className="font-steampunk text-2xl font-bold text-foreground glow-text mb-6 text-center">Strategic Impact</h2>
              <ul className="space-y-3 font-ornate text-sm text-muted-foreground leading-relaxed list-disc pl-6">
                <li>Expands total addressable audience by reducing prerequisite knowledge.</li>
                <li>Creates lightweight engagement funnel feeding deeper Web3 game economies.</li>
                <li>Improves wallet retention via streaks, daily quests, and clue gating.</li>
                <li>Provides safe sandbox for experimenting with UX standards (gas abstraction, signed attestations).</li>
                <li>Signals ecosystem maturity: fun-first, finance-optional.</li>
              </ul>
            </OrnateFrame>

            <div className="text-center animate-ornate-entrance" style={{ animationDelay: '0.6s' }}>
              <blockquote className="font-ornate text-lg text-muted-foreground italic border-l-4 border-primary pl-6 max-w-3xl mx-auto">“Mass adoption of Web3 gaming won’t be won by the most complex economy—it will be won by the simplest daily habit.”</blockquote>
              <p className="font-steampunk text-primary glow-text mt-4">— Casual Engines Collective</p>
            </div>

            <div className="text-center pt-4">
              <p className="font-ornate text-sm text-muted-foreground max-w-2xl mx-auto">This portal is an evolving laboratory. Expect iterative puzzle drops, adaptive clue trees, and experimental asset utility—all oriented toward making Avalanche <span className="text-primary font-semibold">playable by everyone</span>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;