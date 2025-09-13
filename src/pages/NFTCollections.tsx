
import React, { useState } from 'react';
import { Package, Star, Clock, Filter, Grid, List } from 'lucide-react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateFrame } from '@/components/steampunk/OrnateFrame';
import { OrnateCard, OrnateCardContent, OrnateCardHeader, OrnateCardTitle } from '@/components/ui/ornate-card';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';

const NFTCollection = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'rare' | 'legendary' | 'common'>('all');

  const nftItems = [
    {
      id: 1,
      name: "Clockwork Detective Badge",
      rarity: "legendary",
      description: "A master detective's badge with intricate gears",
      acquired: "Sept 15, 2024",
      value: "2.5 ETH"
    },
    {
      id: 2,
      name: "Steam-Powered Magnifying Glass",
      rarity: "rare",
      description: "Enhanced vision tool for the modern investigator",
      acquired: "Sept 10, 2024",
      value: "1.2 ETH"
    },
    {
      id: 3,
      name: "Brass Compass Rose",
      rarity: "rare",
      description: "Always points toward the next mystery",
      acquired: "Sept 8, 2024",
      value: "1.8 ETH"
    },
    {
      id: 4,
      name: "Victorian Case Files",
      rarity: "common",
      description: "Collection of solved mysteries from the past",
      acquired: "Sept 5, 2024",
      value: "0.3 ETH"
    },
    {
      id: 5,
      name: "Ornate Pocket Watch",
      rarity: "legendary",
      description: "Time manipulation device for critical moments",
      acquired: "Sept 1, 2024",
      value: "3.1 ETH"
    },
    {
      id: 6,
      name: "Gear Fragment Set",
      rarity: "common",
      description: "Ancient mechanical parts of unknown origin",
      acquired: "Aug 28, 2024",
      value: "0.5 ETH"
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'common': return 'text-gray-400 border-gray-400';
      default: return 'text-primary border-primary';
    }
  };

  const filteredItems = filter === 'all' ? nftItems : nftItems.filter(item => item.rarity === filter);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-32 left-16 w-28 h-28 border-2 border-primary rounded-full animate-gear-rotate" />
        <div className="absolute bottom-32 right-16 w-20 h-20 border-2 border-primary rounded-full animate-gear-rotate-reverse" />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-primary rounded-full animate-gear-rotate" />
      </div>

      <SteampunkNavbar />
      
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <OrnateFrame className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-steampunk font-bold text-foreground glow-text">
                  NFT Collection
                </h1>
                <p className="text-muted-foreground font-ornate">
                  Your acquired detective artifacts and mysteries
                </p>
              </div>
            </div>
            <GearSpinner size="lg" className="text-primary" />
          </div>
        </OrnateFrame>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-ornate">Filter:</span>
            </div>
            <div className="flex space-x-2">
              {['all', 'legendary', 'rare', 'common'].map((filterType) => (
                <OrnateButton
                  key={filterType}
                  variant={filter === filterType ? "hero" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(filterType as any)}
                  className="capitalize"
                >
                  {filterType}
                </OrnateButton>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <OrnateButton
              variant={viewMode === 'grid' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </OrnateButton>
            <OrnateButton
              variant={viewMode === 'list' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </OrnateButton>
          </div>
        </div>

        {/* Collection Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <OrnateCard>
            <OrnateCardContent className="p-4 text-center">
              <div className="text-2xl font-steampunk font-bold text-primary glow-text">{nftItems.length}</div>
              <div className="text-sm text-muted-foreground font-ornate">Total Items</div>
            </OrnateCardContent>
          </OrnateCard>
          
          <OrnateCard>
            <OrnateCardContent className="p-4 text-center">
              <div className="text-2xl font-steampunk font-bold text-yellow-400">
                {nftItems.filter(item => item.rarity === 'legendary').length}
              </div>
              <div className="text-sm text-muted-foreground font-ornate">Legendary</div>
            </OrnateCardContent>
          </OrnateCard>
          
          <OrnateCard>
            <OrnateCardContent className="p-4 text-center">
              <div className="text-2xl font-steampunk font-bold text-blue-400">
                {nftItems.filter(item => item.rarity === 'rare').length}
              </div>
              <div className="text-sm text-muted-foreground font-ornate">Rare</div>
            </OrnateCardContent>
          </OrnateCard>
          
          <OrnateCard>
            <OrnateCardContent className="p-4 text-center">
              <div className="text-2xl font-steampunk font-bold text-primary glow-text">8.4 ETH</div>
              <div className="text-sm text-muted-foreground font-ornate">Total Value</div>
            </OrnateCardContent>
          </OrnateCard>
        </div>

        {/* NFT Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <OrnateCard key={item.id} className="group cursor-pointer">
                <OrnateCardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-2 py-1 rounded border text-xs font-ornate ${getRarityColor(item.rarity)}`}>
                      {item.rarity.toUpperCase()}
                    </div>
                    <Star className="w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="w-full h-48 bg-surface-elevated rounded-ornate border-2 border-primary/30 flex items-center justify-center mb-4 group-hover:border-primary transition-colors">
                    <GearSpinner size="xl" className="text-primary opacity-50" />
                  </div>
                  
                  <OrnateCardTitle className="text-lg">{item.name}</OrnateCardTitle>
                </OrnateCardHeader>
                
                <OrnateCardContent>
                  <p className="text-sm text-muted-foreground font-ornate mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="font-ornate">{item.acquired}</span>
                    </div>
                    <div className="text-primary font-ornate font-semibold">
                      {item.value}
                    </div>
                  </div>
                </OrnateCardContent>
              </OrnateCard>
            ))}
          </div>
        ) : (
          <OrnateFrame>
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-surface-elevated rounded-ornate border border-primary/30 hover:border-primary transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-surface rounded-ornate border border-primary/30 flex items-center justify-center">
                      <GearSpinner size="sm" className="text-primary opacity-50" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-steampunk font-semibold text-foreground">{item.name}</h3>
                        <div className={`px-2 py-1 rounded border text-xs font-ornate ${getRarityColor(item.rarity)}`}>
                          {item.rarity.toUpperCase()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-ornate mb-2">{item.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span className="font-ornate">{item.acquired}</span>
                        </div>
                        <div className="text-primary font-ornate font-semibold">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Star className="w-5 h-5 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </OrnateFrame>
        )}
      </div>
    </div>
  );
};

export default NFTCollection;
