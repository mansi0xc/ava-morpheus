import React, { useEffect, useMemo, useState } from "react";
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { Component as RaycastBackground } from '@/components/raycast-animated-background';
import { Link } from 'react-router-dom';

type Props = {
  // Accepts array of valid words (lowercase preferred). Component will normalize to lowercase.
  wordList: string[];
  // Optional: fixed center letter (if you want a fixed puzzle). If not provided, one is chosen on mount from letters param.
  initialLetters?: string; // 7-letter string (center first char or any order)
};

type FoundWord = {
  word: string;
  points: number;
  isPangram: boolean;
  timestamp: number;
};

const DEFAULT_PANGRAM_BONUS = 7;

export default function SpellingBee({ wordList, initialLetters }: Props) {
  // Utility: Choose a single base word (prefer 7 letters) and use ONLY its distinct letters.
  // Center letter is chosen (frequency heuristic or middle letter if length 7) and placed first.
  function generateLetterSetFromWordList(
    words: string[],
    randomBase = false,
    prevBase?: string | null
  ): { letters: string[]; base: string } {
    const cleaned = (words || [])
      .map((w) => w.toLowerCase().trim())
      .filter((w) => /^[a-z]{4,7}$/.test(w));
    if (!cleaned.length) return { letters: fallbackRandomLetters(), base: "" };
    const sevenLetter = cleaned.filter((w) => w.length === 7 && new Set(w).size <= 7);
    const candidates = (sevenLetter.length ? sevenLetter : cleaned.filter((w) => new Set(w).size <= 7));
    let candidatePool = candidates;
    if (randomBase && prevBase) {
      const filtered = candidates.filter((c) => c !== prevBase);
      if (filtered.length) candidatePool = filtered;
    }
    const baseWord = randomBase
      ? candidatePool[Math.floor(Math.random() * candidatePool.length)]
      : candidates[0];
    const unique = Array.from(new Set(baseWord.split("")));
    // If fewer than 7 unique letters, pad using other 7-letter candidate words (but still from word list)
    if (unique.length < 7) {
      for (const w of candidates) {
        if (unique.length >= 7) break;
        for (const ch of w) {
          if (!unique.includes(ch)) unique.push(ch);
          if (unique.length >= 7) break;
        }
      }
    }
    // ensure max 7
    const limited = unique.slice(0, 7);
    // choose center letter – pick letter with highest occurrence across all candidate words
    const freq: Record<string, number> = {};
    for (const l of limited) freq[l] = 0;
    for (const w of candidates) for (const ch of w) if (freq[ch] != null) freq[ch]++;
    const center = limited.slice().sort((a, b) => (freq[b] - freq[a]) || a.localeCompare(b))[0];
    const outers = limited.filter((l) => l !== center);
    // shuffle outers
    for (let i = outers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [outers[i], outers[j]] = [outers[j], outers[i]];
    }
    return { letters: [center, ...outers], base: baseWord };
  }

  function fallbackRandomLetters(): string[] {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    const picked: string[] = [];
    while (picked.length < 7) {
      const c = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!picked.includes(c)) picked.push(c);
    }
    return picked;
  }
  // --- Initialize / prepare word set for fast lookup
  const validSet = useMemo(() => {
    const s = new Set<string>();
    for (const w of wordList || []) {
      if (!w) continue;
      s.add(w.toLowerCase());
    }
    return s;
  }, [wordList]);

  // --- Generate or accept 7 letters
  const [baseWord, setBaseWord] = useState<string | null>(null);
  const [letters, setLetters] = useState<string[]>(() => {
    if (initialLetters && initialLetters.length === 7) {
      setBaseWord(initialLetters.toLowerCase());
      return initialLetters.toLowerCase().split("");
    }
    const { letters, base } = generateLetterSetFromWordList(wordList);
    setBaseWord(base);
    return letters;
  });

  // center letter is letters[0] — we'll render with center fixed while shuffling others
  const center = letters[0];

  // state
  const [current, setCurrent] = useState<string>(""); // current input
  const [found, setFound] = useState<FoundWord[]>([]);
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<"ok" | "error" | null>(null);
  const [recentInvalid, setRecentInvalid] = useState<string | null>(null); // used for simple animation class toggle
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // persist to localStorage (optional)
  useEffect(() => {
    const data = localStorage.getItem("spellingbee_v1");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed?.letters && parsed?.found && parsed?.score != null) {
          setLetters(parsed.letters);
          setFound(parsed.found);
          setScore(parsed.score);
        }
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  useEffect(() => {
    const payload = { letters, found, score, baseWord };
    localStorage.setItem("spellingbee_v1", JSON.stringify(payload));
  }, [letters, found, score, baseWord]);

  // countdown timer
  useEffect(() => {
    if (gameOver) return;
    if (timeLeft <= 0) {
      setGameOver(true);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, gameOver]);

  // --- helpers
  const letterSet = useMemo(() => new Set(letters), [letters]);

  function resetMessage() {
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
      setRecentInvalid(null);
    }, 1800);
  }

  function showMessage(text: string, type: "ok" | "error" = "ok") {
    setMessage(text);
    setMessageType(type);
    if (type === "error") setRecentInvalid(text);
    resetMessage();
  }

  function isValidCharacters(word: string) {
    // only letters and all in letterSet
    for (const ch of word) {
      if (ch < "a" || ch > "z") return false;
      if (!letterSet.has(ch)) return false;
    }
    return true;
  }

  function isPangram(word: string) {
    const chars = new Set(word.split(""));
    // must contain all 7 letters
    for (const l of letters) if (!chars.has(l)) return false;
    return true;
  }

  function computePoints(word: string) {
    if (word.length === 4) return 1;
    let pts = word.length;
    if (isPangram(word)) pts += DEFAULT_PANGRAM_BONUS; // pangram bonus
    return pts;
  }

  // submit word
  function submitCurrent() {
  if (gameOver) return;
  const raw = current.trim().toLowerCase();
    if (!raw) {
      showMessage("Type a word first", "error");
      return;
    }
    if (raw.length < 4) {
      showMessage("Words must be at least 4 letters", "error");
      return;
    }
    if (!raw.includes(center)) {
      showMessage(`Must include center letter "${center.toUpperCase()}"`, "error");
      return;
    }
    if (!isValidCharacters(raw)) {
      showMessage("Word uses invalid letters", "error");
      return;
    }
    if (!validSet.has(raw)) {
      showMessage("Word not in word list", "error");
      return;
    }
    if (found.some((f) => f.word === raw)) {
      showMessage("Already found", "error");
      return;
    }

    // Valid! compute points, add to found
    const pts = computePoints(raw);
    const discovered: FoundWord = {
      word: raw,
      points: pts,
      isPangram: isPangram(raw),
      timestamp: Date.now(),
    };
    setFound((s) => [discovered, ...s]);
    setScore((s) => s + pts);
    showMessage(`+${pts} points${discovered.isPangram ? " (Pangram!)" : ""}`, "ok");
    setCurrent("");
  }

  // shuffle outer letters (leave center fixed)
  // (shuffle removed per new requirements)

  // click letter: append
  function appendLetter(ch: string) {
    setCurrent((c) => c + ch);
  }

  // delete last
  function deleteLast() {
    setCurrent((c) => c.slice(0, -1));
  }

  // keyboard support
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // ignore when input not focused globally, but we want always-on for gameplay
      const k = e.key.toLowerCase();
      if (k === "enter") {
        e.preventDefault();
        submitCurrent();
        return;
      }
      if (k === "backspace") {
        e.preventDefault();
        deleteLast();
        return;
      }
      // letter keys: only accept if in letterSet
      if (k.length === 1 && k >= "a" && k <= "z") {
        if (letterSet.has(k)) {
          appendLetter(k);
          e.preventDefault();
        }
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [letterSet, current]); // depends on letterSet and current

  // tiers
  const tiers = [
    { name: "Beginner", min: 0, max: 9 },
    { name: "Good", min: 10, max: 49 },
    { name: "Skilled", min: 50, max: 99 },
    { name: "Expert", min: 100, max: 299 },
    { name: "Genius", min: 300, max: Infinity },
  ];
  const currentTier = tiers.find((t) => score >= t.min && score <= t.max) || tiers[0];
  const nextTier = tiers.find((t) => t.min > currentTier.min);
  const progressPercent = (() => {
    if (!nextTier) return 100;
    const range = nextTier.min - currentTier.min;
    const progressed = score - currentTier.min;
    const pct = Math.round((progressed / range) * 100);
    return Math.max(0, Math.min(100, pct));
  })();

  // found words count
  const foundCount = found.length;

  // clear/reset game
  function newGame() {
    // derive a new set from a random base word in the list
    const { letters: newLetters, base } = generateLetterSetFromWordList(wordList, true, baseWord);
    setLetters(newLetters);
    setBaseWord(base);
    setCurrent("");
    setFound([]);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    localStorage.removeItem("spellingbee_v1");
    showMessage("New puzzle ready", "ok");
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="min-h-screen relative overflow-hidden font-ornate">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <RaycastBackground />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
      </div>
      <SteampunkNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-red-500 glow-text mb-4 tracking-wide">
              STEAM CIPHER
            </h1>
            <p className="font-ornate text-lg text-red-100 max-w-2xl mx-auto">
              Forge words from the seven gilded letters. Use the central rune every time. Craft pangrams to earn rich bonuses.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* MAIN PANEL */}
            <div className="lg:col-span-2 relative rounded-ornate border-2 border-red-700/60 bg-gradient-to-br from-black/60 via-zinc-900/70 to-black/60 shadow-[0_0_25px_-5px_rgba(255,0,0,0.4)] p-6 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,0,0.08),transparent_60%)]" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h2 className="text-2xl font-steampunk text-red-400 drop-shadow">Cipher Grid</h2>
                  <div className="text-xs text-red-300/60 mt-1 tracking-wide uppercase">Base: {baseWord || "?"}</div>
                </div>
                <div className="flex items-center gap-4">
                  <Link to="/catalog" className="hidden md:block">
                    <button
                      className="px-4 py-2 rounded-md bg-zinc-800/70 hover:bg-zinc-700 text-red-200 text-sm font-medium border border-red-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      title="Return to Game Catalogue"
                    >
                      Catalogue
                    </button>
                  </Link>
                  <div className={`font-mono text-2xl px-3 py-1 rounded-md border-2 ${timeLeft <= 5 ? 'border-red-500 text-red-400 animate-pulse' : 'border-red-700/50 text-red-300'} bg-black/40 tracking-widest`}>{formatTime(timeLeft)}</div>
                  <button
                    onClick={newGame}
                    className="px-4 py-2 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    title="New puzzle"
                  >
                    New
                  </button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-10 relative z-10">
                {/* Honeycomb */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="relative w-[360px] h-[360px]" aria-label="Letter honeycomb">
                    {(() => {
                      const positions = [
                        { x: 0, y: 0 },
                        { x: 0, y: -100 },
                        { x: 87, y: -50 },
                        { x: 87, y: 50 },
                        { x: 0, y: 100 },
                        { x: -87, y: 50 },
                        { x: -87, y: -50 },
                      ];
                      return letters.map((ch, idx) => {
                        const p = positions[idx];
                        if (!p) return null;
                        return (
                          <HexButton
                            key={ch + idx}
                            ch={ch}
                            center={idx === 0}
                            onClick={appendLetter}
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
                              transition: 'transform 150ms'
                            }}
                          />
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Input + Side Controls */}
                <div className="flex-1 flex flex-col">
                  <div className={`min-h-[70px] mb-4 p-4 rounded-md border-2 ${recentInvalid ? 'border-red-500/70 bg-red-900/30' : 'border-red-800/60 bg-black/40'} flex items-center justify-between shadow-inner`}> 
                    <div className="flex flex-wrap gap-3 items-end">
                      <div className="text-3xl font-steampunk text-red-300 tracking-widest drop-shadow-sm">{current.toUpperCase()}</div>
                      <div className="text-xs text-red-400/60 tracking-wide">{current.length} letters</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={deleteLast} className="px-3 py-1.5 rounded-md bg-zinc-800/70 border border-red-800/50 text-red-200 hover:bg-zinc-700 transition-colors text-sm font-medium">Delete</button>
                      <button onClick={submitCurrent} className="px-4 py-1.5 rounded-md bg-red-600/80 hover:bg-red-600 text-white font-semibold text-sm shadow-glow">Enter</button>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-red-300/70 mb-4 tracking-wide">
                    Include the <span className="text-red-400 font-semibold">center glyph</span>. Words must be <span className="text-red-400 font-semibold">4+ letters</span> and only use displayed runes.
                  </div>
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {letters.map((l, idx) => (
                        <button
                          key={idx}
                          disabled={gameOver}
                          onClick={() => appendLetter(l)}
                          className={`px-3 py-2 rounded-md font-bold uppercase text-lg tracking-wide disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${idx === 0 ? 'bg-red-600/90 text-white ring-2 ring-red-400 shadow-glow' : 'bg-zinc-800/70 text-red-200 border border-red-800/50 hover:bg-zinc-700'}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-9 mb-4">
                    {message && (
                      <div className={`inline-block px-4 py-1.5 rounded-md text-sm font-medium tracking-wide ${messageType === 'ok' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-300 border border-red-600/50'} shadow`}>{message}</div>
                    )}
                  </div>
                  <div className="mt-2">
                    <h3 className="text-xs font-semibold text-red-300 uppercase tracking-wider mb-2">Recent Finds</h3>
                    <div className="space-y-1 max-h-40 overflow-auto custom-scrollbar pr-1">
                      {found.slice(0, 6).map((f) => (
                        <div key={f.word} className="flex items-center justify-between px-3 py-1 rounded bg-black/40 border border-red-800/40 backdrop-blur-sm">
                          <div className="flex items-center gap-3">
                            <div className="font-mono text-sm text-red-200">{f.word.toUpperCase()}</div>
                            {f.isPangram && <div className="text-[10px] px-2 py-0.5 rounded bg-red-600/30 text-red-200 border border-red-500/40">PANGRAM</div>}
                          </div>
                          <div className="text-sm font-semibold text-red-300">+{f.points}</div>
                        </div>
                      ))}
                      {found.length === 0 && <div className="text-sm text-red-800/50 italic">Forge your first word...</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* SIDEBAR */}
            <aside className="relative rounded-ornate border-2 border-red-700/60 bg-gradient-to-b from-black/70 to-zinc-900/70 p-6 shadow-[0_0_20px_-5px_rgba(255,0,0,0.35)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-red-400/60">Score</div>
                  <div className="text-4xl font-steampunk text-red-300 drop-shadow">{score}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-red-400/60">Found</div>
                  <div className="text-3xl font-semibold text-red-200">{foundCount}</div>
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold tracking-wider text-red-300 uppercase">{currentTier.name}</div>
                  <div className="text-[10px] text-red-400/60">{score} / {nextTier ? nextTier.min : currentTier.min}</div>
                </div>
                <div className="w-full h-3 rounded-full bg-zinc-800/70 overflow-hidden border border-red-800/50">
                  <div className="h-full bg-gradient-to-r from-red-800 via-red-500 to-red-400" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold tracking-wider text-red-300 uppercase">Found Words</h4>
                  <button onClick={() => { setFound([]); setScore(0); localStorage.removeItem('spellingbee_v1'); }} className="text-[10px] text-red-400 hover:text-red-300 transition-colors" title="Clear found">Clear</button>
                </div>
                <div className="max-h-64 overflow-auto space-y-1 pr-1 custom-scrollbar">
                  {found.map((f) => (
                    <div key={f.word} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-black/40 border border-red-800/40">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-red-200">{f.word}</div>
                        {f.isPangram && <div className="text-[9px] px-1.5 py-0.5 rounded bg-red-600/30 text-red-200 border border-red-500/40">PANGRAM</div>}
                      </div>
                      <div className="text-[10px] font-semibold text-red-300">+{f.points}</div>
                    </div>
                  ))}
                  {found.length === 0 && <div className="text-xs text-red-800/50 italic">No words yet</div>}
                </div>
              </div>
              <div className="text-[10px] leading-relaxed text-red-400/70 tracking-wide">
                <div>4-letter = 1 point. Longer = length. Pangram +{DEFAULT_PANGRAM_BONUS} bonus.</div>
                <div className="mt-2">Center glyph required. New resets puzzle & progress.</div>
              </div>
            </aside>
          </div>
        </div>
      </div>
      {gameOver && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-xl p-10 rounded-ornate border-2 border-red-700/70 bg-gradient-to-br from-black/80 to-zinc-900/80 shadow-[0_0_35px_-5px_rgba(255,0,0,0.5)] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,0,0,0.12),transparent_60%)] pointer-events-none" />
            <h3 className="text-3xl font-steampunk text-red-400 mb-4 tracking-wide glow-text">TIME EXPIRED</h3>
            <div className="text-sm text-red-200/80 mb-6 space-y-1 font-ornate">
              <div>Elapsed: <span className="text-red-300 font-semibold">{formatTime(30 - timeLeft)}</span></div>
              <div>Score: <span className="font-semibold text-red-300">{score}</span> <span className="text-red-400/60">({currentTier.name})</span></div>
              <div>Words Forged: <span className="text-red-300 font-semibold">{found.length}</span></div>
            </div>
            <div className="max-h-56 overflow-auto border border-red-800/50 rounded p-4 mb-6 bg-black/40 text-sm space-y-1 custom-scrollbar">
              {found.length === 0 && <div className="text-red-700/50 italic">No creations recorded.</div>}
              {found.map((f) => (
                <div key={f.word} className="flex items-center justify-between text-red-200">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-red-300 tracking-wide">{f.word.toUpperCase()}</span>
                    {f.isPangram && <span className="text-[10px] px-2 py-0.5 rounded bg-red-600/30 text-red-200 border border-red-500/40">PANGRAM</span>}
                  </div>
                  <span className="text-[11px] font-semibold text-red-300">+{f.points}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 flex-wrap">
              <Link to="/catalog">
                <button className="px-6 py-2 rounded-md bg-zinc-800/70 hover:bg-zinc-700 text-red-200 text-sm font-semibold tracking-wide border border-red-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Catalogue</button>
              </Link>
              <button onClick={newGame} className="px-6 py-2 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold tracking-wide shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Forge Anew</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Dedicated hex button with clip-path for honeycomb
  function HexButton({
    ch,
    center: isCenter,
    onClick,
    style,
  }: {
    ch: string;
    center?: boolean;
    onClick: (c: string) => void;
    style?: React.CSSProperties;
  }) {
    if (!ch) return null;
    const base = "w-24 h-24 flex items-center justify-center font-bold uppercase text-3xl tracking-[0.25em] select-none cursor-pointer transition-colors";
    const shape = "[clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]";
    const styleClasses = isCenter
      ? 'bg-gradient-to-br from-red-600 to-red-500 text-white ring-4 ring-red-400 shadow-[0_0_25px_rgba(255,0,0,0.6)] hover:from-red-500 hover:to-red-400'
      : 'bg-zinc-800/80 text-red-200 ring-2 ring-red-900/60 hover:bg-zinc-700/80 hover:text-red-100';
    return (
      <button
        type="button"
        aria-label={isCenter ? `Center letter ${ch}` : `Letter ${ch}`}
        onClick={() => onClick(ch)}
        className={`${base} ${shape} ${styleClasses} active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400`}
        style={style}
      >
        {ch.toUpperCase()}
      </button>
    );
  }
}
