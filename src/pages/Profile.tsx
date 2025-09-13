import React, { useEffect, useState } from 'react';
import { User, Mail, Calendar, MapPin, Trophy, Settings } from 'lucide-react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateFrame } from '@/components/steampunk/OrnateFrame';
import {
  OrnateCard,
  OrnateCardContent,
  OrnateCardHeader,
  OrnateCardTitle,
} from '@/components/ui/ornate-card';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import { useAppSelector } from '@/store/hooks';
import { selectWalletAddress } from '@/store/walletSlice';

type SavedProfile = { displayName: string; location: string };
const STORAGE_KEY = 'profile:v1';

const Profile: React.FC = () => {
  const walletAddress = useAppSelector(selectWalletAddress);

  // ---------- editing state ----------
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState<string>('avax_User');
  const [locationText, setLocationText] = useState<string>('London, England');

  const [draftName, setDraftName] = useState<string>(displayName);
  const [draftLocation, setDraftLocation] = useState<string>(locationText);

  // ---------- load from localStorage on mount ----------
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: Partial<SavedProfile> = JSON.parse(raw);
      const name = parsed.displayName?.trim() || 'avax_User';
      const loc = parsed.location?.trim() || 'London, England';
      setDisplayName(name);
      setLocationText(loc);
      // keep drafts in sync if user immediately edits
      setDraftName(name);
      setDraftLocation(loc);
    } catch {
      /* ignore JSON errors */
    }
  }, []);

  // ---------- helpers ----------
  const formatAddress = (addr: string | null) => {
    if (!addr) return 'No wallet connected';
    return addr.length <= 10 ? addr : `${addr.slice(0, 6)}…${addr.slice(-4)}`;
  };

  const persistProfile = (p: SavedProfile) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      // optional: console audit
      console.log('💾 Saved profile → localStorage', p);
    } catch {
      /* storage may be unavailable */
    }
  };

  const onEditOrSave = () => {
    if (editMode) {
      // Save
      const nextName = (draftName || '').trim() || 'avax_User';
      const nextLoc = (draftLocation || '').trim() || 'London, England';
      setDisplayName(nextName);
      setLocationText(nextLoc);
      persistProfile({ displayName: nextName, location: nextLoc });
      setEditMode(false);
    } else {
      // Enter edit mode; seed drafts
      setDraftName(displayName);
      setDraftLocation(locationText);
      setEditMode(true);
    }
  };

  const onKeyDownSave = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && editMode) onEditOrSave();
  };

  const isSaveDisabled =
    editMode && draftName.trim().length === 0 && draftLocation.trim().length === 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border-2 border-primary rounded-full animate-gear-rotate" />
        <div className="absolute bottom-20 right-10 w-24 h-24 border-2 border-primary rounded-full animate-gear-rotate-reverse" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-primary rounded-full animate-gear-rotate" />
      </div>

      <SteampunkNavbar />

      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <OrnateFrame variant="elevated" className="text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto bg-surface-elevated rounded-full border-4 border-primary flex items-center justify-center shadow-glow">
                  <User className="w-16 h-16 text-primary" />
                </div>
                <GearSpinner size="sm" className="absolute top-2 right-8 text-primary" />
              </div>

              {/* Name */}
              {editMode ? (
                <input
                  autoFocus
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  onKeyDown={onKeyDownSave}
                  placeholder="Enter display name"
                  className="w-full max-w-xs mx-auto text-center mb-2 bg-surface-elevated border-2 border-primary rounded-ornate px-3 py-2 font-steampunk text-xl text-foreground shadow-glow outline-none focus:ring-0 focus:border-primary/80"
                />
              ) : (
                <h1 className="text-2xl font-steampunk font-bold text-foreground glow-text mb-2">
                  {displayName}
                </h1>
              )}

              {/* Wallet address */}
              <p className="text-muted-foreground mb-4 font-ornate">
                {formatAddress(walletAddress)}
              </p>

              {/* Details */}
              <div className="space-y-3 text-sm">
                {/* <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>holmes@avalanche.detective</span>
                </div> */}
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined September 2024</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {editMode ? (
                    <input
                      value={draftLocation}
                      onChange={(e) => setDraftLocation(e.target.value)}
                      onKeyDown={onKeyDownSave}
                      placeholder="Enter location"
                      className="bg-surface-elevated border-2 border-primary rounded-ornate px-2 py-1 font-ornate text-foreground outline-none focus:ring-0 focus:border-primary/80"
                    />
                  ) : (
                    <span>{locationText}</span>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <OrnateButton
                  variant={editMode ? 'default' : 'hero'}
                  className="w-full"
                  onClick={onEditOrSave}
                  disabled={isSaveDisabled}
                  title={editMode ? 'Save profile' : 'Edit your profile'}
                >
                  <Settings className="w-4 h-4" />
                  {editMode ? 'Save' : 'Edit Profile'}
                </OrnateButton>
              </div>
            </OrnateFrame>
          </div>

          {/* Stats and Activities */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <OrnateCard>
                <OrnateCardHeader className="pb-3">
                  <OrnateCardTitle className="text-lg flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>Cases Solved</span>
                  </OrnateCardTitle>
                </OrnateCardHeader>
                <OrnateCardContent>
                  <div className="text-3xl font-steampunk font-bold text-primary glow-text">47</div>
                </OrnateCardContent>
              </OrnateCard>

              <OrnateCard>
                <OrnateCardHeader className="pb-3">
                  <OrnateCardTitle className="text-lg flex items-center space-x-2">
                    <GearSpinner size="sm" />
                    <span>Rank</span>
                  </OrnateCardTitle>
                </OrnateCardHeader>
                <OrnateCardContent>
                  <div className="text-2xl font-steampunk font-bold text-primary glow-text">Master</div>
                </OrnateCardContent>
              </OrnateCard>

              <OrnateCard>
                <OrnateCardHeader className="pb-3">
                  <OrnateCardTitle className="text-lg flex items-center space-x-2">
                    <span className="w-5 h-5 bg-primary rounded-full animate-pulse" />
                    <span>NFTs Owned</span>
                  </OrnateCardTitle>
                </OrnateCardHeader>
                <OrnateCardContent>
                  <div className="text-3xl font-steampunk font-bold text-primary glow-text">23</div>
                </OrnateCardContent>
              </OrnateCard>
            </div>

            <OrnateFrame>
              <h2 className="text-xl font-steampunk font-bold text-foreground glow-text mb-6">
                Recent Activity
              </h2>

              <div className="space-y-4">
                {[
                  { action: 'Solved', case: 'The Missing Clockwork', time: '2 hours ago', reward: '+500 XP' },
                  { action: 'Discovered', case: 'Ancient Gear Fragment', time: '1 day ago', reward: 'NFT Acquired' },
                  { action: 'Completed', case: 'Steam Engine Mystery', time: '3 days ago', reward: '+750 XP' },
                  { action: 'Unlocked', case: "Detective's Badge", time: '1 week ago', reward: 'Achievement' },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-surface-elevated rounded-ornate border border-primary/30 hover:border-primary transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                      <div>
                        <p className="text-foreground font-ornate">
                          <span className="text-primary font-semibold">{activity.action}</span>{' '}
                          {activity.case}
                        </p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <div className="text-primary font-ornate font-semibold text-sm">
                      {activity.reward}
                    </div>
                  </div>
                ))}
              </div>
            </OrnateFrame>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
