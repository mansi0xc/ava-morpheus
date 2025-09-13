import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Component as AnimatedBackground } from '@/components/raycast-animated-background';
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import GameCatalog from "./pages/GameCatalog";
import About from "./pages/About";
import Mystery from "./pages/Mystery";
import CaseClues from "./pages/CaseClues";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import NFTCollection from "./pages/NFTCollections";
import NotFound from "./pages/NotFound";
import { SudokuGame } from '@/games/SudokuGame';
import SpellingBee from '@/games/SpellingBee';
import { MASTER_WORD_LIST } from '@/data/spellingBeeWordList';

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />

    {/* Global Animated Background */}
    <div className="fixed inset-0 -z-50 overflow-hidden">
      <AnimatedBackground />
      {/* Optional dark overlay to ensure readability */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
    </div>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<GameCatalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/mystery" element={<Mystery />} />
        <Route path="/clues" element={<CaseClues />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/nft-collection" element={<NFTCollection />} />
  <Route path="/games/sudoku" element={<SudokuGame />} />
  <Route path="/games/steam-cipher" element={<SpellingBee wordList={MASTER_WORD_LIST} />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
