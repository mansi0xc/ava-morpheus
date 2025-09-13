import React, { useState } from 'react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateCard, OrnateCardContent, OrnateCardHeader, OrnateCardTitle } from '@/components/ui/ornate-card';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import { ChevronDown, ChevronRight, FileText, Calendar, MapPin, User, Search } from 'lucide-react';
import steampunkBg from '@/assets/steampunk-bg.jpg';

interface Clue {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  witness: string;
  description: string;
  evidence: string[];
  importance: 'low' | 'medium' | 'high' | 'critical';
}

const clues: Clue[] = [
  {
    id: 'gear-fragment',
    title: 'Mysterious Gear Fragment',
    category: 'Physical Evidence',
    date: 'March 15, 1887',
    location: 'Clocktower Base',
    witness: 'Inspector Blackwood',
    description: 'A peculiar gear fragment found at the scene, made of an unknown red-tinted metal that seems to generate its own heat.',
    evidence: ['Red metallic composition', 'Self-heating properties', 'Precise engineering marks', 'Avalanche symbol etched'],
    importance: 'critical'
  },
  {
    id: 'steam-readings',
    title: 'Anomalous Steam Pressure Readings',
    category: 'Technical Data',
    date: 'March 16, 1887',
    location: 'Central Boiler Room',
    witness: 'Chief Engineer Morrison',
    description: 'Steam pressure gauges throughout the district showed synchronized spikes at exactly 11:47 PM, defying all known engineering principles.',
    evidence: ['Synchronized pressure spikes', 'Impossible timing precision', 'No external trigger found', 'Pattern matches clocktower incident'],
    importance: 'high'
  },
  {
    id: 'witness-testimony',
    title: 'Witness Account: The Red Glow',
    category: 'Testimony',
    date: 'March 14, 1887',
    location: 'Market Square',
    witness: 'Mrs. Eleanor Hartwell',
    description: 'Local merchant reports seeing an intense red glow emanating from the clocktower windows moments before the mechanical sounds began.',
    evidence: ['Red illumination observed', 'Timing matches other incidents', 'Similar glow reported elsewhere', 'Witness credibility verified'],
    importance: 'medium'
  },
  {
    id: 'blueprint-analysis',
    title: 'Decoded Blueprint Fragments',
    category: 'Documentation',
    date: 'March 18, 1887',
    location: 'Evidence Archive',
    witness: 'Cryptographer Wells',
    description: 'Partially recovered blueprints reveal plans for a device called the "Avalanche Engine" - a steam-powered mechanism of unknown purpose.',
    evidence: ['Avalanche Engine schematic', 'Advanced gear ratios', 'Unknown power source', 'Multiple safety warnings'],
    importance: 'critical'
  },
  {
    id: 'chemical-analysis',
    title: 'Red Substance Composition',
    category: 'Laboratory Results',
    date: 'March 20, 1887',
    location: 'Scientific Institute',
    witness: 'Dr. Victoria Sterling',
    description: 'Chemical analysis reveals the red substance contains elements not found in any known periodic table, suggesting artificial creation.',
    evidence: ['Unknown elemental composition', 'Artificial synthesis confirmed', 'Energy-storing properties', 'Reacts to steam pressure'],
    importance: 'high'
  },
  {
    id: 'timeline-correlation',
    title: 'Incident Timeline Correlation',
    category: 'Investigation Summary',
    date: 'March 22, 1887',
    location: 'Detective Headquarters',
    witness: 'Lead Investigator Cross',
    description: 'All incidents show precise timing correlation, suggesting a coordinated series of events rather than random occurrences.',
    evidence: ['11:47 PM timing pattern', 'Geographic distribution', 'Escalating complexity', 'Central coordination point'],
    importance: 'critical'
  }
];

const importanceColors = {
  low: 'border-blue-400 text-blue-400',
  medium: 'border-yellow-400 text-yellow-400',
  high: 'border-orange-400 text-orange-400',
  critical: 'border-red-400 text-red-400'
};

export const CaseClues: React.FC = () => {
  const [expandedClue, setExpandedClue] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(clues.map(clue => clue.category)))];
  const filteredClues = selectedCategory === 'all' 
    ? clues 
    : clues.filter(clue => clue.category === selectedCategory);

  const toggleClue = (clueId: string) => {
    setExpandedClue(expandedClue === clueId ? null : clueId);
  };

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
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-foreground glow-text mb-6">
              CASE CLUES ARCHIVE
            </h1>
            <p className="font-ornate text-xl text-muted-foreground max-w-3xl mx-auto">
              A comprehensive collection of evidence, testimonies, and analytical findings from the Avalanche Engine investigation.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <OrnateButton
                  key={category}
                  variant={selectedCategory === category ? "hero" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category === 'all' ? 'All Categories' : category}
                </OrnateButton>
              ))}
            </div>
          </div>

          {/* Background Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <GearSpinner size="xl" className="absolute top-40 right-16 opacity-10 w-24 h-24" />
            <GearSpinner size="lg" reverse className="absolute bottom-32 left-16 opacity-15 w-20 h-20" />
            <div className="absolute top-60 left-20 text-6xl font-steampunk text-primary/10 animate-glow-pulse">
              XI
            </div>
          </div>

          {/* Clues List */}
          <div className="space-y-6 relative z-10">
            {filteredClues.map((clue, index) => (
              <OrnateCard 
                key={clue.id}
                className="transition-all duration-300 hover:shadow-glow cursor-pointer animate-ornate-entrance"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Clue Header */}
                <OrnateCardHeader 
                  className="cursor-pointer"
                  onClick={() => toggleClue(clue.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {expandedClue === clue.id ? (
                        <ChevronDown className="w-6 h-6 text-primary" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-primary" />
                      )}
                      <div>
                        <OrnateCardTitle className="text-xl mb-2">
                          {clue.title}
                        </OrnateCardTitle>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{clue.category}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{clue.date}</span>
                          </span>
                          <span className={`px-2 py-1 rounded text-xs border ${importanceColors[clue.importance]}`}>
                            {clue.importance.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <GearSpinner 
                      size="sm" 
                      className={`transition-opacity ${expandedClue === clue.id ? 'opacity-100' : 'opacity-50'}`} 
                    />
                  </div>
                </OrnateCardHeader>

                {/* Expanded Content */}
                {expandedClue === clue.id && (
                  <OrnateCardContent className="border-t border-primary/30 pt-6 animate-ornate-entrance">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Description and Details */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-steampunk text-lg font-bold text-foreground glow-text mb-2">
                            Description
                          </h4>
                          <p className="font-ornate text-foreground leading-relaxed">
                            {clue.description}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-steampunk text-sm font-bold text-primary mb-1">
                              Location
                            </h5>
                            <p className="font-ornate text-sm text-muted-foreground flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {clue.location}
                            </p>
                          </div>
                          <div>
                            <h5 className="font-steampunk text-sm font-bold text-primary mb-1">
                              Witness
                            </h5>
                            <p className="font-ornate text-sm text-muted-foreground flex items-center">
                              <User className="w-4 h-4 mr-1" />
                              {clue.witness}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Evidence List */}
                      <div>
                        <h4 className="font-steampunk text-lg font-bold text-foreground glow-text mb-4">
                          Evidence Points
                        </h4>
                        <div className="space-y-2">
                          {clue.evidence.map((evidence, idx) => (
                            <div 
                              key={idx}
                              className="flex items-start space-x-2 p-2 border border-primary/30 rounded bg-primary/10"
                            >
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <p className="font-ornate text-sm text-foreground">
                                {evidence}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-primary/30">
                      <OrnateButton variant="ghost" size="sm">
                        <Search className="w-4 h-4 mr-2" />
                        Cross-Reference
                      </OrnateButton>
                      <OrnateButton variant="gear" size="sm">
                        Add to Investigation
                      </OrnateButton>
                    </div>
                  </OrnateCardContent>
                )}
              </OrnateCard>
            ))}
          </div>

          {/* Summary Panel */}
          <div className="mt-16">
            <OrnateCard className="text-center">
              <OrnateCardContent className="space-y-4">
                <h3 className="font-steampunk text-2xl font-bold text-foreground glow-text">
                  Investigation Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-steampunk text-primary glow-text">{clues.length}</div>
                    <div className="text-sm text-muted-foreground">Total Clues</div>
                  </div>
                  <div>
                    <div className="text-2xl font-steampunk text-red-400">{clues.filter(c => c.importance === 'critical').length}</div>
                    <div className="text-sm text-muted-foreground">Critical Evidence</div>
                  </div>
                  <div>
                    <div className="text-2xl font-steampunk text-orange-400">{clues.filter(c => c.importance === 'high').length}</div>
                    <div className="text-sm text-muted-foreground">High Priority</div>
                  </div>
                  <div>
                    <div className="text-2xl font-steampunk text-green-400">78%</div>
                    <div className="text-sm text-muted-foreground">Case Progress</div>
                  </div>
                </div>
              </OrnateCardContent>
            </OrnateCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseClues;