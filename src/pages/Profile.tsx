
import React from 'react';
import { User, Mail, Calendar, MapPin, Trophy, Settings } from 'lucide-react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateFrame } from '@/components/steampunk/OrnateFrame';
import { OrnateCard, OrnateCardContent, OrnateCardHeader, OrnateCardTitle } from '@/components/ui/ornate-card';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';

const Profile = () => {
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
              
              <h1 className="text-2xl font-steampunk font-bold text-foreground glow-text mb-2">
                Inspector Holmes
              </h1>
              <p className="text-muted-foreground mb-4 font-ornate">Master Detective</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>holmes@avalanche.detective</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined September 2024</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>London, England</span>
                </div>
              </div>
              
              <div className="mt-6">
                <OrnateButton variant="hero" className="w-full">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </OrnateButton>
              </div>
            </OrnateFrame>
          </div>

          {/* Stats and Activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Cards */}
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

            {/* Recent Activity */}
            <OrnateFrame>
              <h2 className="text-xl font-steampunk font-bold text-foreground glow-text mb-6">
                Recent Activity
              </h2>
              
              <div className="space-y-4">
                {[
                  { action: "Solved", case: "The Missing Clockwork", time: "2 hours ago", reward: "+500 XP" },
                  { action: "Discovered", case: "Ancient Gear Fragment", time: "1 day ago", reward: "NFT Acquired" },
                  { action: "Completed", case: "Steam Engine Mystery", time: "3 days ago", reward: "+750 XP" },
                  { action: "Unlocked", case: "Detective's Badge", time: "1 week ago", reward: "Achievement" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-surface-elevated rounded-ornate border border-primary/30 hover:border-primary transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                      <div>
                        <p className="text-foreground font-ornate">
                          <span className="text-primary font-semibold">{activity.action}</span> {activity.case}
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
