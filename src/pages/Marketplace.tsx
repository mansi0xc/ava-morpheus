import React, { useEffect, useMemo, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateCard, OrnateCardContent, OrnateCardHeader, OrnateCardTitle } from '@/components/ui/ornate-card';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import { ShoppingCart, Flame, Eye, ShieldHalf, BookOpen } from 'lucide-react';
import contentData from '@/content.json';
import { abi as marketplaceAbi, address as marketplaceAddress } from '@/abi/Marketplace';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectInventoryFor, toggleClue, togglePowerup, migrateGuestToAddress } from '@/store/inventorySlice';

interface Powerup { id: string; name: string; effect: string; price: number; icon: any; }
interface ContentClue { id: number; title: string; description: string; }
interface ContentData { case: { clues: ContentClue[] } }
const caseData = contentData as unknown as ContentData;
const clueList: ContentClue[] = caseData.case?.clues || [];

const powerups: Powerup[] = [
  { id: 'crucible', name: "Elaine's Crucible", effect: 'Halves number of games needed to earn a clue.', price: 10, icon: Flame },
  { id: 'chronos-eye', name: 'Eye of Chronos', effect: "Curse item: target player can't vote for 3 days.", price: 10, icon: Eye },
  { id: 'void-core', name: 'Void Core', effect: "Defense item: nullifies all active curse effects.", price: 10, icon: ShieldHalf },
];

const addrOrGuest = (addr?: string) => addr ?? 'guest';

export const Marketplace: React.FC = () => {
  const { isConnected, address } = useAccount();
  const key = useMemo(() => addrOrGuest(address), [address]);

  // Redux inventory (persistent)
  const dispatch = useAppDispatch();
  const inventory = useAppSelector((s) => selectInventoryFor(s as any, key));
  const ownedPowerups = new Set(inventory.powerups);
  const ownedClues = new Set(inventory.clues);

  // Migrate guest inventory when user connects
  useEffect(() => {
    if (isConnected && address) {
      dispatch(migrateGuestToAddress({ address }));
    }
  }, [isConnected, address, dispatch]);

  // ===== On-chain hooks (m8 branch) =====
  // Use writeContractAsync so we can await and catch rejections
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { isLoading: isPending, isSuccess, isError } = useWaitForTransactionReceipt({ hash: txHash });

  // Track which specific items are pending (so we can show spinners)
  const [pendingPowerups, setPendingPowerups] = useState<Set<string>>(new Set());
  const [pendingClues, setPendingClues] = useState<Set<number>>(new Set());
  // Inventory panel visibility
  const [inventoryOpen, setInventoryOpen] = useState<boolean>(false);

  // ----- BUY handlers (on-chain); on success, persist to Redux -----
  const handleBuyPowerup = async (id: string) => {
    if (!isConnected || pendingPowerups.has(id)) return;
    try {
      setPendingPowerups(prev => new Set(prev).add(id));
      const hash = await writeContractAsync({
        address: marketplaceAddress as `0x${string}`,
        abi: marketplaceAbi as any,
        functionName: 'payLarge',
        args: [],
        account: address as `0x${string}` | undefined,
        value: parseEther('10'),
      } as any);
      setTxHash(hash);
    } catch (err) {
      // User rejected or send error -> clear pending immediately
      console.error('Error purchasing powerup:', err);
      setPendingPowerups(prev => {
        const copy = new Set(prev); copy.delete(id); return copy;
      });
    }
  };

  const handleBuyClue = async (id: number) => {
    if (!isConnected || pendingClues.has(id)) return;
    try {
      setPendingClues(prev => new Set(prev).add(id));
      const hash = await writeContractAsync({
        address: marketplaceAddress as `0x${string}`,
        abi: marketplaceAbi as any,
        functionName: 'paySmall',
        args: [],
        account: address as `0x${string}` | undefined,
        value: parseEther('0.2'),
      } as any);
      setTxHash(hash);
    } catch (err) {
      // User rejected or send error -> clear pending immediately
      console.error('Error purchasing clue:', err);
      setPendingClues(prev => {
        const copy = new Set(prev); copy.delete(id); return copy;
      });
    }
  };

  // When the tx confirms, flip the corresponding item in Redux and clear pending
  useEffect(() => {
    if (!isSuccess || !txHash) return;

    // Powerup success
    let purchasedSomething = false;
    if (pendingPowerups.size > 0) {
      const id = Array.from(pendingPowerups)[0];
      dispatch(togglePowerup({ address: key, id }));
      setPendingPowerups(new Set());
      purchasedSomething = true;
    }
    if (pendingClues.size > 0) {
      const id = Array.from(pendingClues)[0];
      dispatch(toggleClue({ address: key, id }));
      setPendingClues(new Set());
      purchasedSomething = true;
    }
    if (purchasedSomething) {
      setInventoryOpen(true); // auto-open inventory after successful purchase
    }
    setTxHash(undefined);
  }, [isSuccess, txHash, pendingPowerups, pendingClues, dispatch, key]);

  // If a sent tx fails (revert), clear pending and reset hash
  useEffect(() => {
    if (!isError) return;
    setPendingPowerups(new Set());
    setPendingClues(new Set());
    setTxHash(undefined);
  }, [isError]);

  // ----- SELL handlers removed from UI (no selling) -----
  // const handleSellPowerup = (id: string) => { ... }
  // const handleSellClue = (id: number) => { ... }

  return (
    <div className="min-h-screen relative">
      <SteampunkNavbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-foreground glow-text mb-6">
              MARKETPLACE
            </h1>
            <p className="font-ornate text-xl text-muted-foreground max-w-3xl mx-auto">
              Acquire rare mechanical components, ornate decorations, and powerful upgrades from master craftsmen across the steampunk realm.
            </p>
          </div>

          {/* Powerups */}
          <div className="mb-12">
            <h2 className="font-steampunk text-3xl font-bold text-foreground glow-text mb-6 text-center">Powerups</h2>
            <p className="font-ornate text-center text-muted-foreground mb-8 max-w-2xl mx-auto text-sm">
              Strategic items that influence gameplay and progression. Purchase or relinquish (sell back) by toggling below. Selling simply removes ownership (no refund logic implemented yet).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {powerups.map((p, idx) => (
                <OrnateCard
                  key={p.id}
                  className="group transition-all duration-300 hover:scale-105 hover:shadow-glow animate-ornate-entrance"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                >
                  <OrnateCardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <p.icon className="w-14 h-14 text-primary" />
                        <GearSpinner size="sm" className="absolute -top-2 -right-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <OrnateCardTitle className="text-xl mb-2">{p.name}</OrnateCardTitle>
                  </OrnateCardHeader>

                  <OrnateCardContent className="space-y-4">
                    <p className="font-ornate text-sm text-muted-foreground text-center">{p.effect}</p>
                    <div className="text-center text-2xl font-steampunk font-bold text-primary glow-text">
                      {p.price} <span className="text-sm text-muted-foreground ml-1">AVAX</span>
                    </div>

                    {/* ==== MERGED BUTTON (m8 + main) ==== */}
                    <OrnateButton
                      // No Sell option: when owned, show disabled 'Owned'
                      variant={ownedPowerups.has(p.id) ? 'hero' : 'gear'}
                      className="w-full"
                      disabled={
                        !isConnected ||
                        ownedPowerups.has(p.id) ||
                        pendingPowerups.has(p.id) ||
                        isPending
                      }
                      onClick={() => {
                        if (!ownedPowerups.has(p.id)) handleBuyPowerup(p.id);
                      }}
                    >
                      {pendingPowerups.has(p.id) ? (
                        <>
                          <GearSpinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : ownedPowerups.has(p.id) ? (
                        <>Owned</>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {!isConnected ? 'Connect Wallet' : 'Buy'}
                        </>
                      )}
                    </OrnateButton>
                  </OrnateCardContent>
                </OrnateCard>
              ))}
            </div>
          </div>

          {/* Clue Exchange */}
          <div className="mt-4">
            <h2 className="font-steampunk text-3xl font-bold text-foreground glow-text mb-6 text-center">Clue Exchange</h2>
            <p className="font-ornate text-center text-muted-foreground mb-8 max-w-2xl mx-auto text-sm">
              Acquire investigative clues (or relinquish ones you hold) to progress mysteries. Each clue is valued at <span className="text-primary font-semibold">0.2 AVAX</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {clueList.map((c, idx) => (
                <OrnateCard
                  key={c.id}
                  className="group transition-all duration-300 hover:shadow-glow animate-ornate-entrance"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  {/* Remove header click that used to sell/buy */}
                  <OrnateCardHeader>
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <OrnateCardTitle className="text-lg">{c.title}</OrnateCardTitle>
                      </div>
                    </div>
                  </OrnateCardHeader>

                  <OrnateCardContent className="pt-2">
                    <div className="flex items-center justify-between mb-3 text-xs font-ornate">
                      <span className="text-muted-foreground">
                        Value: <span className="text-primary font-semibold">0.2 AVAX</span>
                      </span>
                      <span className={`px-2 py-1 rounded border ${ownedClues.has(c.id) ? 'border-green-400 text-green-400' : 'border-primary/40 text-primary/70'}`}>
                        {ownedClues.has(c.id) ? 'Owned' : 'Available'}
                      </span>
                    </div>

                    {/* ==== MERGED BUTTON (m8 + main) ==== */}
                    <OrnateButton
                      // No Sell option: when owned, show disabled 'Owned'
                      variant={ownedClues.has(c.id) ? 'hero' : 'gear'}
                      className="w-full"
                      disabled={
                        !isConnected ||
                        ownedClues.has(c.id) ||
                        pendingClues.has(c.id) ||
                        isPending
                      }
                      onClick={() => {
                        if (!ownedClues.has(c.id)) handleBuyClue(c.id);
                      }}
                    >
                      {pendingClues.has(c.id) ? (
                        <>
                          <GearSpinner size="sm" className="mr-2" />
                          Processing...
                        </>
                      ) : ownedClues.has(c.id) ? (
                        <>Owned</>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {!isConnected ? 'Connect Wallet' : 'Buy'}
                        </>
                      )}
                    </OrnateButton>
                  </OrnateCardContent>
                </OrnateCard>
              ))}
            </div>
          </div>

          {/* Inventory floating panel */}
          {isConnected && (
            <div className="fixed bottom-6 right-6 z-50 space-y-2 w-64">
              <div className="flex justify-end">
                <OrnateButton
                  variant="gear"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInventoryOpen(o => !o)}
                >
                  {inventoryOpen ? 'Hide Inventory' : 'Show Inventory'}
                </OrnateButton>
              </div>
              {inventoryOpen && (
                <OrnateCard className="animate-ornate-entrance">
                  <OrnateCardContent className="space-y-4 relative">
                    <button
                      onClick={() => setInventoryOpen(false)}
                      className="absolute top-2 right-2 text-xs px-2 py-1 rounded border border-primary/40 text-primary/70 hover:text-primary bg-background/60"
                      aria-label="Close inventory"
                    >×</button>
                    <h3 className="font-steampunk text-lg font-bold text-foreground glow-text pr-4">Inventory</h3>
                    <div className="space-y-2 text-xs font-ornate">
                      <div className="flex justify-between"><span>Powerups</span><span className="text-primary font-semibold">{ownedPowerups.size}</span></div>
                      <div className="flex justify-between"><span>Clues</span><span className="text-primary font-semibold">{ownedClues.size}</span></div>
                    </div>
                    {(ownedPowerups.size > 0 || ownedClues.size > 0) && (
                      <div className="space-y-2">
                        {ownedPowerups.size > 0 && (
                          <div>
                            <p className="font-steampunk text-[11px] text-primary mb-1">Powerups Owned</p>
                            <ul className="space-y-1 max-h-24 overflow-auto pr-1">
                              {Array.from(ownedPowerups).map(id => {
                                const meta = powerups.find(p => p.id === id);
                                return <li key={id} className="font-ornate text-[11px] text-muted-foreground">{meta?.name || id}</li>;
                              })}
                            </ul>
                          </div>
                        )}
                        {ownedClues.size > 0 && (
                          <div>
                            <p className="font-steampunk text-[11px] text-primary mb-1">Clues Owned</p>
                            <ul className="flex flex-wrap gap-1 text-[10px] font-ornate">
                              {Array.from(ownedClues).map(id => (
                                <li key={id} className="px-2 py-0.5 rounded border border-primary/30 text-primary/80">#{id}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="text-[10px] text-muted-foreground">Prototype marketplace: economic balancing & refunds TBD.</div>
                  </OrnateCardContent>
                </OrnateCard>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;