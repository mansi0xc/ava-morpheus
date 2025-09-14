import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateCard, OrnateCardContent, OrnateCardHeader, OrnateCardTitle } from '@/components/ui/ornate-card';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import { ShoppingCart, Star, Crown, Zap, Shield, Gem, Filter, SortAsc } from 'lucide-react';

interface MarketItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  description: string;
  stats?: { [key: string]: number };
  icon: any;
  inStock: number;
  seller: string;
}

const marketItems: MarketItem[] = [
  {
    id: 'precision-gears',
    name: 'Precision Gear Set',
    category: 'Tools',
    price: 150,
    currency: 'AVAX',
    rarity: 'rare',
    description: 'Master-crafted gears that enhance mechanical precision by 25%',
    stats: { Precision: 25, Durability: 18 },
    icon: Crown,
    inStock: 7,
    seller: 'Master Cogsmith'
  },
  {
    id: 'steam-booster',
    name: 'Steam Pressure Booster',
    category: 'Upgrades',
    price: 89,
    currency: 'AVAX',
    rarity: 'epic',
    description: 'Increases steam output efficiency for faster puzzle solving',
    stats: { Speed: 30, Efficiency: 22 },
    icon: Zap,
    inStock: 3,
    seller: 'Engineer Morrison'
  },
  {
    id: 'ornate-frame',
    name: 'Ornate Display Frame',
    category: 'Cosmetics',
    price: 45,
    currency: 'AVAX',
    rarity: 'common',
    description: 'Decorative frame that showcases your achievements in style',
    stats: { Prestige: 10 },
    icon: Gem,
    inStock: 12,
    seller: 'Artisan Blackwood'
  },
  {
    id: 'crimson-crystal',
    name: 'Crimson Power Crystal',
    category: 'Power Sources',
    price: 350,
    currency: 'AVAX',
    rarity: 'legendary',
    description: 'Rare crystal that amplifies all mechanical functions dramatically',
    stats: { Power: 50, Stability: 45, Resonance: 30 },
    icon: Shield,
    inStock: 1,
    seller: 'Crystal Merchant'
  },
  {
    id: 'clockwork-compass',
    name: 'Clockwork Navigation Compass',
    category: 'Tools',
    price: 120,
    currency: 'AVAX',
    rarity: 'rare',
    description: 'Advanced compass that reveals hidden paths and secret areas',
    stats: { Navigation: 35, Discovery: 20 },
    icon: Crown,
    inStock: 5,
    seller: 'Explorer\'s Guild'
  },
  {
    id: 'steam-badge',
    name: 'Elite Engineer Badge',
    category: 'Cosmetics',
    price: 75,
    currency: 'AVAX',
    rarity: 'epic',
    description: 'Prestigious badge that displays your engineering mastery',
    stats: { Status: 25, Recognition: 30 },
    icon: Star,
    inStock: 8,
    seller: 'Engineering Council'
  }
];

const rarityColors = {
  common: 'border-gray-400 text-gray-400 bg-gray-400/10',
  rare: 'border-blue-400 text-blue-400 bg-blue-400/10',
  epic: 'border-purple-400 text-purple-400 bg-purple-400/10',
  legendary: 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
};

const categories = ['all', ...Array.from(new Set(marketItems.map(item => item.category)))];

export const Marketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'rarity' | 'name'>('name');
  const [cart, setCart] = useState<Set<string>>(new Set());
  const { isConnected } = useAccount();

  const filteredItems = marketItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rarity') {
      const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    }
    return a.name.localeCompare(b.name);
  });

  const addToCart = (itemId: string) => {
    if (!isConnected) return; // ignore when disconnected
    setCart(prev => new Set([...prev, itemId]));
  };

  const removeFromCart = (itemId: string) => {
    if (!isConnected) return; // ignore when disconnected
    setCart(prev => {
      const newCart = new Set(prev);
      newCart.delete(itemId);
      return newCart;
    });
  };

  const isInCart = (itemId: string) => cart.has(itemId);

  return (
    <div className="min-h-screen relative">
      <SteampunkNavbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-foreground glow-text mb-6">
              MARKETPLACE
            </h1>
            <p className="font-ornate text-xl text-muted-foreground max-w-3xl mx-auto">
              Acquire rare mechanical components, ornate decorations, and powerful upgrades from master craftsmen 
              across the steampunk realm.
            </p>
          </div>

          {/* Filters and Sorting */}
          <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Filter className="w-5 h-5 text-primary mt-2 mr-2" />
              {categories.map((category) => (
                <OrnateButton
                  key={category}
                  variant={selectedCategory === category ? "hero" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'All Items' : category}
                </OrnateButton>
              ))}
            </div>

            {/* Sort Control */}
            <div className="flex items-center space-x-2">
              <SortAsc className="w-5 h-5 text-primary" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-surface border-2 border-primary rounded px-3 py-1 text-foreground text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rarity">Sort by Rarity</option>
              </select>
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <GearSpinner size="xl" className="absolute top-32 right-16 opacity-10 w-32 h-32" />
            <GearSpinner size="lg" reverse className="absolute bottom-40 left-20 opacity-15 w-24 h-24" />
            <div className="absolute top-60 left-32 text-8xl font-steampunk text-primary/10 animate-glow-pulse">
              ⚙
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {sortedItems.map((item, index) => (
              <OrnateCard 
                key={item.id}
                className="group transition-all duration-300 hover:scale-105 hover:shadow-glow animate-ornate-entrance"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <OrnateCardHeader className="text-center">
                  {/* Rarity Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${rarityColors[item.rarity]}`}>
                      {item.rarity.toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-muted-foreground">in stock: {item.inStock}</span>
                    </div>
                  </div>

                  {/* Item Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <item.icon className="w-16 h-16 text-primary" />
                      <GearSpinner 
                        size="sm" 
                        className="absolute -top-2 -right-2 opacity-50 group-hover:opacity-100 transition-opacity" 
                      />
                    </div>
                  </div>

                  <OrnateCardTitle className="text-xl mb-2">
                    {item.name}
                  </OrnateCardTitle>
                </OrnateCardHeader>
                
                <OrnateCardContent className="space-y-4">
                  <p className="font-ornate text-sm text-muted-foreground text-center">
                    {item.description}
                  </p>

                  {/* Stats */}
                  {item.stats && (
                    <div className="space-y-2">
                      <h4 className="font-steampunk text-sm font-bold text-primary">
                        Statistics:
                      </h4>
                      {Object.entries(item.stats).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{stat}:</span>
                          <span className="text-primary font-bold">+{value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Seller */}
                  <div className="text-center text-xs text-muted-foreground border-t border-primary/30 pt-3">
                    Sold by: <span className="text-primary">{item.seller}</span>
                  </div>

                  {/* Price and Actions */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <span className="text-2xl font-steampunk font-bold text-primary glow-text">
                        {item.price}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {item.currency}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      {isInCart(item.id) ? (
                        <OrnateButton 
                          variant="hero" 
                          className="flex-1"
                          onClick={() => removeFromCart(item.id)}
                          disabled={!isConnected}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {isConnected ? 'Remove' : 'Connect Wallet'}
                        </OrnateButton>
                      ) : (
                        <OrnateButton 
                          variant="gear" 
                          className="flex-1"
                          onClick={() => addToCart(item.id)}
                          disabled={item.inStock === 0 || !isConnected}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {!isConnected ? 'Connect Wallet' : item.inStock === 0 ? 'Out of Stock' : 'Buy'}
                        </OrnateButton>
                      )}
                      <OrnateButton variant="ghost" size="icon">
                        <Star className="w-4 h-4" />
                      </OrnateButton>
                    </div>
                  </div>
                </OrnateCardContent>
              </OrnateCard>
            ))}
          </div>

          {/* Cart Summary */}
          {isConnected && cart.size > 0 && (
            <div className="fixed bottom-6 right-6 z-50">
              <OrnateCard className="min-w-[250px] animate-ornate-entrance">
                <OrnateCardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-steampunk text-lg font-bold text-foreground glow-text">
                      Cart
                    </h3>
                    <div className="flex items-center space-x-1">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                      <span className="text-primary font-bold">{cart.size}</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-steampunk font-bold text-primary glow-text">
                      {marketItems
                        .filter(item => cart.has(item.id))
                        .reduce((total, item) => total + item.price, 0)} AVAX
                    </div>
                  </div>
                  
                  <OrnateButton variant="hero" className="w-full">
                    Proceed to Checkout
                  </OrnateButton>
                </OrnateCardContent>
              </OrnateCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;