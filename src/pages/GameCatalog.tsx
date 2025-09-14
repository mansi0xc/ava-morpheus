import React from 'react';
import { Link } from 'react-router-dom';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateCard, OrnateCardContent, OrnateCardHeader, OrnateCardTitle } from '@/components/ui/ornate-card';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import { Puzzle, Grid3X3, BookOpen, Zap, Target, Crown } from 'lucide-react';

const games = [
  {
    id: 'sudoku',
    title: 'Clockwork Sudoku',
    description: 'Solve mechanical number puzzles with precision timing',
    icon: Grid3X3,
    difficulty: 'Medium',
    players: '1 Player'
  },
  {
    id: 'wordle', //spelling bee renamed to wordle for integration consistency
    title: "Iron Lexicon",
    description: "Decode intricate words through clockwork letters and steam-driven puzzles.",
    icon: BookOpen,
    difficulty: 'Easy',
    players: '1 Player'
  },
  {
    id: 'puzzle',
    title: 'Gear Assembly',
    description: 'Reconstruct intricate clockwork mechanisms',
    icon: Puzzle,
    difficulty: 'Hard',
    players: '1-2 Players'
  },
  {
    id: 'reflex',
    title: 'Lightning Reflexes',
    description: 'Test your speed against mechanical challenges',
    icon: Zap,
    difficulty: 'Medium',
    players: '1-4 Players'
  },
  {
    id: 'precision',
    title: 'Precision Engineering',
    description: 'Master the art of mechanical precision',
    icon: Target,
    difficulty: 'Hard',
    players: '1 Player'
  },
  {
    id: 'tournament',
    title: 'Grand Championship',
    description: 'Compete in the ultimate steampunk tournament',
    icon: Crown,
    difficulty: 'Expert',
    players: '2-8 Players'
  }
];

const difficultyColors = {
  'Easy': 'text-green-400',
  'Medium': 'text-yellow-400', 
  'Hard': 'text-orange-400',
  'Expert': 'text-red-400'
};

export const GameCatalog: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <SteampunkNavbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-foreground glow-text mb-6">
              GAME CATALOGUE
            </h1>
            <p className="font-ornate text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose your mechanical challenge from our collection of steam-powered entertainment. 
              Each game has been crafted with precision engineering and clockwork artistry.
            </p>
          </div>

          {/* Background Decorative Gears */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <GearSpinner size="xl" className="absolute top-32 left-10 opacity-10 w-32 h-32" />
            <GearSpinner size="lg" reverse className="absolute top-48 right-16 opacity-15 w-24 h-24" />
            <GearSpinner size="md" className="absolute bottom-40 left-20 opacity-20 w-16 h-16" />
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <OrnateCard 
                key={game.id}
                className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <OrnateCardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <game.icon className="w-12 h-12 text-primary" />
                      <GearSpinner 
                        size="sm" 
                        className="absolute -top-2 -right-2 opacity-50 group-hover:opacity-100 transition-opacity" 
                      />
                    </div>
                  </div>
                  <OrnateCardTitle className="text-xl mb-2">
                    {game.title}
                  </OrnateCardTitle>
                </OrnateCardHeader>
                
                <OrnateCardContent className="text-center space-y-4">
                  <p className="font-ornate text-sm text-muted-foreground">
                    {game.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-semibold ${difficultyColors[game.difficulty as keyof typeof difficultyColors]}`}>
                      {game.difficulty}
                    </span>
                    <span className="text-muted-foreground">
                      {game.players}
                    </span>
                  </div>
                  
                  {game.id === 'sudoku' ? (
                    <Link to="/games/sudoku">
                      <OrnateButton 
                        variant="gear" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        ENTER GAME
                      </OrnateButton>
                    </Link>
                  ) : game.id === 'wordle' ? (
                    <Link to="/games/steam-cipher">
                      <OrnateButton 
                        variant="gear" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        ENTER GAME
                      </OrnateButton>
                    </Link>
                  ) : game.id === 'puzzle' ? (
                    <Link to="/games/gear-assembly">
                      <OrnateButton 
                        variant="gear" 
                        className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        ENTER GAME
                      </OrnateButton>
                    </Link>
                  ) : (
                    <OrnateButton 
                      variant="gear" 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      ENTER GAME
                    </OrnateButton>
                  )}
                </OrnateCardContent>
              </OrnateCard>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="inline-block p-8 border-2 border-primary rounded-ornate bg-surface/80 backdrop-blur-sm shadow-glow">
              <h3 className="font-steampunk text-2xl font-bold text-foreground glow-text mb-4">
                Ready for Adventure?
              </h3>
              <p className="font-ornate text-muted-foreground mb-6 max-w-md">
                Each game offers unique challenges that will test your wit, reflexes, and strategic thinking 
                in the most entertaining mechanical ways.
              </p>
              <div className="flex justify-center space-x-4">
                <Link to="/mystery">
                  <OrnateButton variant="hero">
                    Explore Mysteries
                  </OrnateButton>
                </Link>
                <Link to="/marketplace">
                  <OrnateButton variant="ornate">
                    Visit Marketplace
                  </OrnateButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCatalog;