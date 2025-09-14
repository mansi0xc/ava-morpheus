import React, { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateCard, OrnateCardContent, OrnateCardHeader, OrnateCardTitle } from '@/components/ui/ornate-card';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import contentData from '@/content.json';
import { getGamesPlayed } from '@/lib/progress';

interface ContentClue { id: number; title: string; description: string; avaxConcept: string; educationalLinks?: { briefExplanation?: string; url?: string; title?: string }[]; difficulty: string; }
interface ContentData { case: { clues: ContentClue[] } }
const caseData = contentData as unknown as ContentData;
const clues = caseData.case?.clues || [];

export const CaseClues: React.FC = () => {
  const [expandedClue, setExpandedClue] = useState<number | null>(null);
  const { isConnected, address } = useAccount();
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);

  // Unlock rule: 1 clue per 2 games.
  const unlockedCount = Math.min(clues.length, Math.floor(gamesPlayed / 2));

  const refreshProgress = useCallback(() => {
    setGamesPlayed(getGamesPlayed(address));
  }, [address]);

  useEffect(() => { refreshProgress(); }, [refreshProgress]);
  useEffect(() => {
    const handler = () => refreshProgress();
    window.addEventListener('gameProgressUpdated', handler as any);
    return () => window.removeEventListener('gameProgressUpdated', handler as any);
  }, [refreshProgress]);

  const toggleClue = (clueId: number) => setExpandedClue(prev => prev === clueId ? null : clueId);

  return (
    <div className="min-h-screen relative">
      <SteampunkNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-foreground glow-text mb-6">CASE CLUES ARCHIVE</h1>
            <p className="font-ornate text-xl text-muted-foreground max-w-3xl mx-auto">A comprehensive collection of evidence, testimonies, and analytical findings from the Avalanche Engine investigation.</p>
          </div>

          {/* Wallet gating */}
          {!isConnected && (
            <div className="mb-16 text-center">
              <p className="font-ornate text-lg text-muted-foreground">Connect Wallet to reveal clue archive.</p>
            </div>
          )}

          {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <GearSpinner size="xl" className="absolute top-40 right-16 opacity-10 w-24 h-24" />
              <GearSpinner size="lg" reverse className="absolute bottom-32 left-16 opacity-15 w-20 h-20" />
              <div className="absolute top-60 left-20 text-6xl font-steampunk text-primary/10 animate-glow-pulse">XI</div>
            </div>

          {isConnected && (
            <div className="space-y-6 relative z-10">
              <div className="mb-2 px-4 py-3 rounded border border-primary/30 bg-primary/5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="text-sm font-ornate text-muted-foreground">
                  Games Played: <span className="text-primary font-semibold">{gamesPlayed}</span> &middot; Unlocked Clues: <span className="text-primary font-semibold">{unlockedCount}</span>/<span>{clues.length}</span>
                </div>
                <div className="text-[11px] text-muted-foreground font-ornate">Unlock Rule: 1 clue per 2 completed games.</div>
              </div>
              {clues.map((clue, index) => {
                const locked = index >= unlockedCount;
                const expanded = expandedClue === clue.id && !locked;
                return (
                  <OrnateCard
                    key={clue.id}
                    className={`transition-all duration-300 hover:shadow-glow cursor-pointer animate-ornate-entrance ${locked ? 'opacity-60 grayscale hover:shadow-none cursor-not-allowed' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <OrnateCardHeader
                      className="cursor-pointer"
                      onClick={() => !locked && toggleClue(clue.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          {expanded ? (
                            <ChevronDown className="w-6 h-6 text-primary mt-1" />
                          ) : (
                            <ChevronRight className="w-6 h-6 text-primary mt-1" />
                          )}
                          <div>
                            <OrnateCardTitle className="text-xl mb-2 flex items-center gap-2">
                              {clue.title}
                              {locked && (
                                <span className="text-[10px] px-2 py-0.5 rounded border border-primary/40 text-primary/70 font-ornate tracking-wide">LOCKED</span>
                              )}
                            </OrnateCardTitle>
                            <p className="font-ornate text-sm text-muted-foreground leading-relaxed line-clamp-2">
                              {locked ? 'Play more games to unlock this clue.' : clue.description}
                            </p>
                          </div>
                        </div>
                        <GearSpinner size="sm" className={`transition-opacity ${expanded ? 'opacity-100' : 'opacity-50'}`} />
                      </div>
                    </OrnateCardHeader>
                    {expanded && (
                      <OrnateCardContent className="border-t border-primary/30 pt-6 animate-ornate-entrance">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-steampunk text-lg font-bold text-foreground glow-text mb-2">Description</h4>
                            <p className="font-ornate text-foreground leading-relaxed">{clue.description}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-steampunk text-sm font-bold text-primary mb-1">Avalanche Concept</h5>
                              <p className="font-ornate text-sm text-muted-foreground">{clue.avaxConcept}</p>
                            </div>
                            <div>
                              <h5 className="font-steampunk text-sm font-bold text-primary mb-1">Difficulty</h5>
                              <p className="font-ornate text-sm text-muted-foreground capitalize">{clue.difficulty}</p>
                            </div>
                          </div>
                          {clue.educationalLinks && clue.educationalLinks.length > 0 && (
                            <div>
                              <h5 className="font-steampunk text-sm font-bold text-primary mb-3">Educational Links</h5>
                              <div className="space-y-2">
                                {clue.educationalLinks.map((link, idx) => {
                                  const text = link.briefExplanation || link.title || 'Additional Resource';
                                  return (
                                    <div key={idx} className="p-3 rounded border border-primary/30 bg-primary/10 space-y-1">
                                      <p className="font-ornate text-xs text-foreground leading-relaxed">{text}</p>
                                      {link.url && (
                                        <a
                                          href={link.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-block text-[10px] font-ornate text-primary hover:text-primary/80 underline underline-offset-2 break-all"
                                        >
                                          {link.url}
                                        </a>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          <div className="flex justify-end space-x-4 pt-4 border-t border-primary/30">
                            <OrnateButton variant="ghost" size="sm">
                              <Search className="w-4 h-4 mr-2" />
                              Cross-Reference
                            </OrnateButton>
                            {/* <OrnateButton variant="gear" size="sm">Add to Investigation</OrnateButton> */}
                          </div>
                        </div>
                      </OrnateCardContent>
                    )}
                  </OrnateCard>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseClues;