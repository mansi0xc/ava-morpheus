import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
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
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
