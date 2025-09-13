import React, { useState } from 'react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { OrnateCard, OrnateCardContent, OrnateCardHeader, OrnateCardTitle } from '@/components/ui/ornate-card';
import { OrnateButton } from '@/components/ui/ornate-button';
import { GearSpinner } from '@/components/steampunk/GearSpinner';
import { Eye, MapPin, Clock, Lightbulb, Lock, Key } from 'lucide-react';
import steampunkBg from '@/assets/steampunk-bg.jpg';

interface MysteryNode {
  id: string;
  title: string;
  description: string;
  icon: any;
  status: 'locked' | 'available' | 'solved';
  connections: string[];
  clue?: string;
}

const mysteryNodes: MysteryNode[] = [
  {
    id: 'clocktower',
    title: 'The Clocktower Incident',
    description: 'Strange mechanical sounds emanate from the abandoned clocktower',
    icon: Clock,
    status: 'available',
    connections: ['workshop', 'journal'],
    clue: 'The gears stopped at precisely 11:47...'
  },
  {
    id: 'workshop',
    title: 'Engineer\'s Workshop',
    description: 'Tools scattered, blueprints torn, and a mysterious red substance',
    icon: MapPin,
    status: 'locked',
    connections: ['clocktower', 'laboratory'],
    clue: 'The red substance glows under steam pressure...'
  },
  {
    id: 'journal',
    title: 'Lost Journal',
    description: 'Pages filled with frantic calculations and gear diagrams',
    icon: Eye,
    status: 'locked',
    connections: ['clocktower', 'laboratory'],
    clue: 'Entry 47: The Avalanche formula is almost complete...'
  },
  {
    id: 'laboratory',
    title: 'Secret Laboratory',
    description: 'Hidden beneath the workshop, strange experiments continue',
    icon: Lightbulb,
    status: 'locked',
    connections: ['workshop', 'journal', 'vault'],
    clue: 'Steam-powered crystallization process discovered...'
  },
  {
    id: 'vault',
    title: 'The Crimson Vault',
    description: 'A heavily secured chamber with avalanche-red crystals',
    icon: Lock,
    status: 'locked',
    connections: ['laboratory'],
    clue: 'The final piece of the Avalanche Engine...'
  }
];

export const Mystery: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [solvedNodes, setSolvedNodes] = useState<Set<string>>(new Set());

  const handleNodeClick = (nodeId: string) => {
    const node = mysteryNodes.find(n => n.id === nodeId);
    if (node && node.status === 'available') {
      setSelectedNode(nodeId);
    }
  };

  const solveNode = (nodeId: string) => {
    setSolvedNodes(prev => new Set([...prev, nodeId]));
    setSelectedNode(null);
    
    // Unlock connected nodes
    const node = mysteryNodes.find(n => n.id === nodeId);
    if (node) {
      node.connections.forEach(connectedId => {
        const connectedNode = mysteryNodes.find(n => n.id === connectedId);
        if (connectedNode && connectedNode.status === 'locked') {
          connectedNode.status = 'available';
        }
      });
    }
  };

  const getNodeStatus = (node: MysteryNode) => {
    if (solvedNodes.has(node.id)) return 'solved';
    return node.status;
  };

  const selectedNodeData = selectedNode ? mysteryNodes.find(n => n.id === selectedNode) : null;

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
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-foreground glow-text mb-6">
              MYSTERY BOARD
            </h1>
            <p className="font-ornate text-xl text-muted-foreground max-w-3xl mx-auto">
              Unravel the secrets of the Avalanche Engine through interconnected clues and mechanical mysteries. 
              Each piece reveals part of the greater puzzle.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Mystery Network */}
            <div className="lg:col-span-2">
              <div className="relative min-h-[600px] p-8 border-2 border-primary rounded-ornate bg-surface/80 backdrop-blur-sm">
                <h2 className="font-steampunk text-2xl font-bold text-foreground glow-text mb-8 text-center">
                  INVESTIGATION NETWORK
                </h2>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  {mysteryNodes.map(node => 
                    node.connections.map(connId => {
                      const connectedNode = mysteryNodes.find(n => n.id === connId);
                      if (!connectedNode) return null;
                      
                      const isActive = getNodeStatus(node) !== 'locked' || getNodeStatus(connectedNode) !== 'locked';
                      
                      return (
                        <line
                          key={`${node.id}-${connId}`}
                          x1="50%"
                          y1="20%"
                          x2="50%"
                          y2="80%"
                          stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                          strokeWidth="2"
                          className={isActive ? "animate-glow-pulse" : ""}
                          opacity={isActive ? "0.8" : "0.3"}
                        />
                      );
                    })
                  )}
                </svg>

                {/* Mystery Nodes */}
                <div className="relative z-10 space-y-8">
                  {mysteryNodes.map((node, index) => {
                    const status = getNodeStatus(node);
                    const IconComponent = node.icon;
                    
                    return (
                      <div
                        key={node.id}
                        className={`absolute transition-all duration-300 ${
                          status === 'available' ? 'cursor-pointer hover:scale-110' : ''
                        }`}
                        style={{
                          left: `${20 + (index % 3) * 30}%`,
                          top: `${20 + Math.floor(index / 3) * 25}%`,
                        }}
                        onClick={() => handleNodeClick(node.id)}
                      >
                        <div className={`
                          relative p-4 rounded-ornate border-2 transition-all duration-300
                          ${status === 'locked' && 'opacity-50 border-muted bg-muted/20'}
                          ${status === 'available' && 'border-primary bg-surface shadow-glow hover:shadow-glow'}
                          ${status === 'solved' && 'border-green-400 bg-green-400/20 shadow-glow'}
                        `}>
                          <div className="text-center">
                            <div className="flex justify-center mb-2">
                              {status === 'locked' ? (
                                <Lock className="w-8 h-8 text-muted-foreground" />
                              ) : (
                                <IconComponent className={`w-8 h-8 ${
                                  status === 'solved' ? 'text-green-400' : 'text-primary'
                                }`} />
                              )}
                            </div>
                            <h3 className={`font-steampunk text-sm font-bold ${
                              status === 'locked' ? 'text-muted-foreground' : 
                              status === 'solved' ? 'text-green-400' : 'text-foreground'
                            }`}>
                              {node.title}
                            </h3>
                            {status === 'solved' && (
                              <div className="mt-2">
                                <Key className="w-4 h-4 text-green-400 mx-auto" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Background Decorative Gears */}
                <GearSpinner size="lg" className="absolute top-4 right-4 opacity-10 w-16 h-16" />
                <GearSpinner size="md" reverse className="absolute bottom-4 left-4 opacity-15 w-12 h-12" />
              </div>
            </div>

            {/* Investigation Panel */}
            <div className="space-y-6">
              {selectedNodeData ? (
                <OrnateCard className="animate-ornate-entrance">
                  <OrnateCardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <selectedNodeData.icon className="w-8 h-8 text-primary" />
                      <OrnateCardTitle className="text-lg">
                        {selectedNodeData.title}
                      </OrnateCardTitle>
                    </div>
                  </OrnateCardHeader>
                  <OrnateCardContent className="space-y-4">
                    <p className="font-ornate text-sm text-muted-foreground">
                      {selectedNodeData.description}
                    </p>
                    
                    {selectedNodeData.clue && (
                      <div className="p-3 border border-primary/50 rounded bg-primary/10">
                        <p className="font-ornate text-sm text-primary italic">
                          "{selectedNodeData.clue}"
                        </p>
                      </div>
                    )}
                    
                    <OrnateButton 
                      variant="hero" 
                      className="w-full"
                      onClick={() => solveNode(selectedNodeData.id)}
                    >
                      INVESTIGATE CLUE
                    </OrnateButton>
                  </OrnateCardContent>
                </OrnateCard>
              ) : (
                <OrnateCard>
                  <OrnateCardContent className="text-center space-y-4">
                    <GearSpinner size="lg" className="mx-auto opacity-50" />
                    <p className="font-ornate text-muted-foreground">
                      Select a mystery node to begin your investigation
                    </p>
                  </OrnateCardContent>
                </OrnateCard>
              )}

              {/* Progress Tracker */}
              <OrnateCard>
                <OrnateCardHeader>
                  <OrnateCardTitle className="text-lg text-center">
                    Investigation Progress
                  </OrnateCardTitle>
                </OrnateCardHeader>
                <OrnateCardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Clues Solved:</span>
                      <span className="text-primary font-bold">
                        {solvedNodes.size} / {mysteryNodes.length}
                      </span>
                    </div>
                    <div className="w-full bg-surface-elevated rounded-full h-3 border border-primary/50">
                      <div 
                        className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                        style={{ width: `${(solvedNodes.size / mysteryNodes.length) * 100}%` }}
                      />
                    </div>
                    {solvedNodes.size === mysteryNodes.length && (
                      <div className="text-center p-3 border border-green-400 rounded bg-green-400/20">
                        <p className="font-steampunk text-green-400 font-bold glow-text">
                          MYSTERY SOLVED!
                        </p>
                      </div>
                    )}
                  </div>
                </OrnateCardContent>
              </OrnateCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mystery;