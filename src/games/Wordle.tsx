import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { Component as RaycastBackground } from '@/components/raycast-animated-background';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { incrementGamesPlayed } from '@/lib/progress';

// Word list (for demo; you can expand this)
const WORDS = ["REACT", "CODES", "GAMES", "WORDS", "TAILS", "SUDOKU", "SOLVE"];
const WORD_LENGTH = 5;
const MAX_TRIES = 6;

// Utility: pick random word
const getRandomWord = () => {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return word.padEnd(WORD_LENGTH, " ").slice(0, WORD_LENGTH);
};

type LetterStatus = "correct" | "present" | "absent" | "empty" | "invalid";

const Wordle: React.FC = () => {
  const [solution, setSolution] = useState<string>("");
  const [guesses, setGuesses] = useState<string[]>(Array(MAX_TRIES).fill(""));
  const [statuses, setStatuses] = useState<LetterStatus[][]>(
    Array(MAX_TRIES).fill(Array(WORD_LENGTH).fill("empty"))
  );
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [shakeRow, setShakeRow] = useState<number | null>(null);

  const { address } = useAccount();

  const recordCompletionOnce = useCallback(() => {
    // simple guard: use a ref? lightweight inline check with gameOver state transitions
    // We'll rely on gameOver just being set once per outcome; if needed, could add a ref.
    if (address) incrementGamesPlayed(address);
  }, [address]);

  const startNewGame = useCallback(() => {
    setSolution(getRandomWord());
    setGuesses(Array(MAX_TRIES).fill(""));
    setStatuses(Array(MAX_TRIES).fill(Array(WORD_LENGTH).fill("empty")));
    setCurrentGuessIndex(0);
    setCurrentGuess("");
    setGameOver(false);
    setMessage("");
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  // Toast auto-dismiss after 2s (only for errors, not for game over)
  useEffect(() => {
    if (message && !gameOver) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message, gameOver]);

  // Evaluate guess against solution
  const evaluateGuess = (guess: string): LetterStatus[] => {
    const result: LetterStatus[] = Array(WORD_LENGTH).fill("absent");
    const solArr = solution.split("");
    const guessArr = guess.split("");

    guessArr.forEach((char, i) => {
      if (char === solArr[i]) {
        result[i] = "correct";
        solArr[i] = "*";
      }
    });

    guessArr.forEach((char, i) => {
      if (result[i] !== "correct") {
        const charIndexInSol = solArr.indexOf(char);
        if (charIndexInSol !== -1) {
          result[i] = "present";
          solArr[charIndexInSol] = "*";
        }
      }
    });

    return result;
  };

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameOver) return;

      if (key === "ENTER") {
        if (currentGuess.length !== WORD_LENGTH) {
          setMessage("Not enough letters");
          setShakeRow(currentGuessIndex);
          setTimeout(() => setShakeRow(null), 500);
          return;
        }

        if (!WORDS.includes(currentGuess)) {
          setMessage("Not in word list");
          setShakeRow(currentGuessIndex);

          const newGuesses = [...guesses];
          newGuesses[currentGuessIndex] = currentGuess;
          setGuesses(newGuesses);

          const newStatuses = [...statuses];
          newStatuses[currentGuessIndex] = Array(WORD_LENGTH).fill("invalid");
          setStatuses(newStatuses);

          if (currentGuessIndex + 1 === MAX_TRIES) {
            setGameOver(true);
            setMessage(`Game Over! Word was ${solution}`);
          } else {
            setCurrentGuessIndex(currentGuessIndex + 1);
            setCurrentGuess("");
          }

          setTimeout(() => setShakeRow(null), 500);
          return;
        }

        // ✅ valid guess flow
        const newGuesses = [...guesses];
        newGuesses[currentGuessIndex] = currentGuess;
        setGuesses(newGuesses);

        const newStatuses = [...statuses];
        newStatuses[currentGuessIndex] = evaluateGuess(currentGuess);
        setStatuses(newStatuses);

        if (currentGuess === solution) {
          setGameOver(true);
          setMessage("You Win!");
          recordCompletionOnce();
        } else if (currentGuessIndex + 1 === MAX_TRIES) {
          setGameOver(true);
          setMessage(`Game Over! Word was ${solution}`);
          recordCompletionOnce();
        } else {
          setCurrentGuessIndex(currentGuessIndex + 1);
          setCurrentGuess("");
          setMessage("");
        }
      } else if (key === "BACKSPACE") {
        if (guesses[currentGuessIndex]) return;
        setCurrentGuess(currentGuess.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(currentGuess + key);
      }
    },
    [currentGuess, currentGuessIndex, gameOver, guesses, solution, statuses]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
        e.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyPress]);

  // Removed unused standalone Keyboard component; inline version retained in keyboard panel.

  return (
    <div className="min-h-screen relative overflow-hidden font-ornate">
      <div className="absolute inset-0 -z-10">
        <RaycastBackground />
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
      </div>
      <SteampunkNavbar />
      <div className="pt-24 pb-16 px-4 flex flex-col items-center">
        <div className="w-full flex flex-col items-center">
          <div className="flex flex-col items-center text-center gap-4 mb-8 max-w-3xl">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-red-500 glow-text tracking-wide mb-2">GEAR ASSEMBLY - WORDLE</h1>
            <p className="text-red-200/80 font-ornate text-sm md:text-base leading-relaxed px-4">Deduce the secret five-letter code using mechanical logic. Correct letters lock into place; present runes glow with potential. Six calibration attempts before the mechanism locks.</p>
            <div className="flex items-center gap-3 mt-2">
              <Link to="/catalog">
                <button className="px-4 py-2 rounded-md bg-zinc-800/70 hover:bg-zinc-700 text-red-200 text-sm font-medium border border-red-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Catalogue</button>
              </Link>
              {gameOver && (
                <button onClick={startNewGame} className="px-5 py-2 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Play Again</button>
              )}
            </div>
          </div>
          <div className="inline-grid w-fit mx-auto grid-cols-1 lg:grid-cols-[auto_minmax(340px,460px)] gap-8 items-start">
            {/* Board Panel (reduced size) */}
            <div className="relative rounded-ornate border-2 border-red-700/60 bg-gradient-to-br from-black/60 via-zinc-900/70 to-black/60 p-6 shadow-[0_0_25px_-5px_rgba(255,0,0,0.35)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,0,0,0.08),transparent_60%)] pointer-events-none" />
              <div className="grid grid-rows-6 gap-2">
                {guesses.map((guess, i) => {
                  const current = i === currentGuessIndex ? currentGuess : guess;
                  const statusRow = statuses[i];
                  return (
                    <motion.div
                      key={i}
                      className="flex gap-2"
                      animate={shakeRow === i ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {[...Array(WORD_LENGTH)].map((_, j) => {
                        const char = current[j] || '';
                        const status = statusRow[j];
                        let base = 'bg-black/40 border-2 border-red-800/40';
                        let animationDelay = 0;
                        if (status === 'invalid') {
                          base = 'bg-red-900/40 border-red-600/70';
                        } else if (status !== 'empty') {
                          animationDelay = j * 0.08;
                        }
                        const revealClass = status === 'correct'
                          ? 'bg-gradient-to-br from-red-600 to-red-500 text-white border-red-400'
                          : status === 'present'
                          ? 'bg-gradient-to-br from-yellow-600 to-amber-500 text-white border-amber-400'
                          : status === 'absent'
                          ? 'bg-zinc-800/80 text-red-300 border-red-900/60'
                          : '';
                        return (
                          <motion.div
                            key={j}
                            className="relative w-12 h-12 md:w-16 md:h-16"
                            initial={{ rotateY: 0 }}
                            animate={{ rotateY: status !== 'empty' ? 180 : 0 }}
                            transition={{ duration: 0.55, delay: animationDelay }}
                          >
                            <div className={`absolute w-full h-full flex items-center justify-center text-3xl font-steampunk tracking-wide uppercase rounded-md transition-colors duration-300 ${base}`} style={{ backfaceVisibility: 'hidden' }}>{char}</div>
                            {status !== 'empty' && status !== 'invalid' && (
                              <div className={`absolute w-full h-full flex items-center justify-center text-3xl font-steampunk tracking-wide uppercase rounded-md transition-colors duration-300 ${revealClass}`} style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>{char}</div>
                            )}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  );
                })}
              </div>
              {gameOver && (
                <div className="mt-8 text-center">
                  <div className={`inline-block px-5 py-2 rounded-md text-sm font-semibold tracking-wide border ${message === 'You Win!' ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40' : 'bg-red-600/30 text-red-300 border-red-500/40'}`}>{message}</div>
                </div>
              )}
            </div>
            {/* Keyboard Panel (optimized for full fit) */}
            <div className="rounded-ornate border-2 border-red-700/60 bg-gradient-to-b from-black/60 to-zinc-900/70 p-5 pt-4 pb-5 px-6 shadow-[0_0_18px_-5px_rgba(255,0,0,0.3)] flex flex-col max-w-[460px]">
              <h2 className="text-lg font-steampunk text-red-400 mb-3 tracking-wide">Control Console</h2>
              <div>
                <div className="flex flex-col gap-1.5 px-1">
                  {(() => {
                    const keys = [ 'QWERTYUIOP'.split(''), 'ASDFGHJKL'.split(''), ['ENTER', ...'ZXCVBNM'.split(''), 'BACKSPACE'] ];
                    const getKeyStatus = (key: string) => {
                      let status: LetterStatus = 'empty';
                      for (let i = 0; i < currentGuessIndex; i++) {
                        for (let j = 0; j < WORD_LENGTH; j++) {
                          if (guesses[i][j] === key) {
                            const s = statuses[i][j];
                            if (s === 'correct') return 'correct';
                            if (s === 'present') status = 'present';
                            if (s === 'absent' && status !== 'present') status = 'absent';
                          }
                        }
                      }
                      return status;
                    };
                    return keys.map((row, i) => (
                      <div key={i} className="flex justify-center gap-1">
                        {row.map((key) => {
                          const status = getKeyStatus(key);
                          let base = 'bg-zinc-800/70 text-red-200 border border-red-800/50 hover:bg-zinc-700';
                          if (status === 'correct') base = 'bg-red-600 text-white border-red-400';
                          else if (status === 'present') base = 'bg-amber-600 text-white border-amber-400';
                          else if (status === 'absent') base = 'bg-zinc-900 text-red-400 border-red-900/70';
                          return (
                            <motion.button
                              key={key}
                              onClick={() => handleKeyPress(key)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.92 }}
                              className={`h-10 rounded font-semibold uppercase text-[11px] tracking-wide transition-colors px-2 ${key.length === 1 ? 'min-w-[30px]' : key === 'ENTER' ? 'min-w-[54px]' : key === 'BACKSPACE' ? 'min-w-[54px]' : 'min-w-[50px]'} ${base}`}
                            >
                              {key === 'BACKSPACE' ? '⌫' : key}
                            </motion.button>
                          );
                        })}
                      </div>
                    ));
                  })()}
                </div>
              </div>
              <div className="mt-4">
                {!gameOver && (
                  <div className="text-[10px] text-red-300/70 leading-relaxed tracking-wide">
                    Enter a valid five-letter word. Green = correct rune & slot. Amber = rune exists elsewhere. Gray = inert.
                  </div>
                )}
                {gameOver && (
                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <div className={`text-xs font-semibold tracking-wide ${message === 'You Win!' ? 'text-emerald-300' : 'text-red-300'}`}>{message}</div>
                    <button onClick={startNewGame} className="px-3 py-1.5 rounded-md bg-red-600/80 hover:bg-red-600 text-white text-[10px] font-semibold shadow-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400">Reset</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {message && !gameOver && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-md text-sm font-medium bg-red-700/80 text-red-100 border border-red-500/50 shadow-glow z-50"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Wordle;
