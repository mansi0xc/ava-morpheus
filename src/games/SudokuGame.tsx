import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { Component as RaycastBackground } from '@/components/raycast-animated-background';
import { OrnateButton } from '@/components/ui/ornate-button';
import { Link } from 'react-router-dom';

// (Typing effect removed per refactor: UI streamlined to immediate gameplay)

// Helper functions to generate a complete Sudoku puzzle from scratch
class SudokuGenerator {
  // Generate a complete, valid Sudoku board
  static generateSolvedBoard(): number[][] {
    // Start with an empty board
    const board: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));

    // Solve the empty board to generate a random solution
    this.solveSudoku(board);
    return board;
  }

  // Shuffle array in-place using Fisher-Yates algorithm
  static shuffle(array: number[]): number[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Check if a number is valid in a given position
  static isValid(board: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let y = 0; y < 9; y++) {
      if (board[y][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        if (board[boxRow + y][boxCol + x] === num) return false;
      }
    }

    return true;
  }

  // Solve the Sudoku board using backtracking
  static solveSudoku(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        // Find an empty cell
        if (board[row][col] === 0) {
          // Try digits 1-9 in a random order
          const nums = this.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of nums) {
            // Check if valid
            if (this.isValid(board, row, col, num)) {
              // Place the digit
              board[row][col] = num;

              // Recursively solve the rest
              if (this.solveSudoku(board)) {
                return true;
              }

              // If we get here, we need to backtrack
              board[row][col] = 0;
            }
          }
          // No valid digit found
          return false;
        }
      }
    }
    // All cells filled
    return true;
  }
}

// Generate a new puzzle from the solution
const generatePuzzle = (difficulty: string): { puzzle: number[][], solution: number[][] } => {
  // Generate a new solved board
  const solution = SudokuGenerator.generateSolvedBoard();

  // Create a copy for the puzzle
  const puzzle = solution.map(row => [...row]);

  // Determine how many cells to remove based on difficulty
  let removeCount = difficulty === "easy" ? 30 : difficulty === "medium" ? 45 : 55;

  // Remove digits to create the puzzle
  while (removeCount > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      removeCount--;
    }
  }

  return { puzzle, solution };
};

export const SudokuGame = () => {
  // Fixed difficulty per requirements
  const difficulty = 'medium';
  // Core game state
  const [board, setBoard] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [prefilled, setPrefilled] = useState<boolean[][]>([]);
  const [startTime, setStartTime] = useState<number | undefined>(undefined);
  const [endTime, setEndTime] = useState<number | undefined>(undefined);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [cellStatus, setCellStatus] = useState<('correct' | 'incorrect' | 'unfilled')[][]>([]);
  const [errors, setErrors] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [timer, setTimer] = useState<number>(0);

  // New states for added functionality
  const [selectedCell, setSelectedCell] = useState<{ row: number, col: number } | null>(null);
  const [history, setHistory] = useState<number[][][]>([]);
  const [notes, setNotes] = useState<Set<number>[][]>(Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set())));
  const [notesMode, setNotesMode] = useState<boolean>(false);
  const [hintsRemaining, setHintsRemaining] = useState<number>(3);
  const timerRef = useRef<number | null>(null);

  // Format time as mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Start the game (medium fixed)
  const startGame = () => {
    // Generate a new random puzzle each time
    const { puzzle, solution } = generatePuzzle(difficulty);
    setBoard(puzzle);
    setSolution(solution);
    setPrefilled(puzzle.map((row) => row.map((num) => num !== 0)));

    // Reset game state
    setStartTime(Date.now());
    setIsGameComplete(false);
  setEndTime(undefined);
    setErrors(0);
    setShowError(false);
    setErrorMessage("");
    setSelectedCell(null);
    setHistory([puzzle.map(row => [...row])]);
    setHintsRemaining(3); // Reset hints (medium difficulty)
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => new Set())));
    setNotesMode(false);
    setTimer(0);

    // Initialize cell status
    setCellStatus(puzzle.map(row =>
      row.map(cell => cell === 0 ? 'unfilled' : 'correct')
    ));
  };

  // Timer useEffect
  useEffect(() => {
    if (!isGameComplete) {
      timerRef.current = window.setInterval(() => setTimer(prev => prev + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isGameComplete]);

  // Update cell status when board changes
  useEffect(() => {
    if (board.length === 0 || solution.length === 0) return;

    const newStatus = board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        if (cell === 0) return 'unfilled';
        if (cell === solution[rowIndex][colIndex]) return 'correct';
        return 'incorrect';
      })
    );

    setCellStatus(newStatus);

    // Check for game completion
    const isComplete = board.length > 0 && board.every((row, rowIndex) =>
      row.every((cell, colIndex) => cell !== 0 && cell === solution[rowIndex][colIndex])
    );

    if (isComplete) {
      setEndTime(Date.now());
      setIsGameComplete(true);
      // Completed
    }
  }, [board, solution]);

  // Handle cell value changes
  const handleChange = (row: number, col: number, value: number) => {
    if (prefilled[row][col]) return; // Prevent changing prefilled cells

    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = value;
    
    // Check if the value is valid
    if (value !== 0) {
      // Check if the new value is correct
      const isCorrect = value === solution[row][col];

      // If incorrect, show error message
      if (!isCorrect) {
        setErrors(prev => prev + 1);
        setErrorMessage(`That's not the correct number for this position!`);
        setShowError(true);

        // Hide error message after 2 seconds
        setTimeout(() => {
          setShowError(false);
        }, 2000);
      }
    }
    setBoard(newBoard);
    // Add to history
    setHistory([...history, newBoard.map(r => [...r])]);
    // Clear notes for the cell when a value is entered
    if (value !== 0) {
      const newNotes = notes.map(row => row.map(cellNotes => new Set(cellNotes)));
      newNotes[row][col].clear();
      setNotes(newNotes);
    }
  };

  // Handle number button click
  const handleNumberClick = (num: number) => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    if (prefilled[row][col]) return;

    if (notesMode) {
      const newNotes = notes.map(row => row.map(cellNotes => new Set(cellNotes)));
      if (newNotes[row][col].has(num)) {
        newNotes[row][col].delete(num);
      } else {
        newNotes[row][col].add(num);
      }
      setNotes(newNotes);
    } else {
      handleChange(row, col, num);
    }
  };

  // Handle undo button click
  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      setBoard(newHistory[newHistory.length - 1].map(row => [...row]));
      setHistory(newHistory);
    }
  };

  // Handle erase button click
  const handleErase = () => {
    if (selectedCell) {
      handleChange(selectedCell.row, selectedCell.col, 0);
    }
  };

  // Handle hints button click
  const handleHint = () => {
    if (!selectedCell || hintsRemaining <= 0) return;
    const { row, col } = selectedCell;
    if (board[row][col] === 0) {
      const correctValue = solution[row][col];
      handleChange(row, col, correctValue);
      setHintsRemaining(hintsRemaining - 1);
    }
  };

  // Start a new game after completion
  const handlePlayAgain = () => {
    startGame();
  };

  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameComplete) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberClick(parseInt(e.key, 10));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (e.key.startsWith('Arrow') && selectedCell) {
        let { row, col } = selectedCell;
        if (e.key === 'ArrowUp') row = (row - 1 + 9) % 9;
        else if (e.key === 'ArrowDown') row = (row + 1) % 9;
        else if (e.key === 'ArrowLeft') col = (col - 1 + 9) % 9;
        else if (e.key === 'ArrowRight') col = (col + 1) % 9;
        setSelectedCell({ row, col });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, isGameComplete]);

  // Auto start medium game on mount
  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Raycast Background */}
      <div className="absolute inset-0 -z-10">
        <RaycastBackground />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      </div>
      <SteampunkNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-steampunk text-5xl md:text-6xl font-bold text-foreground glow-text mb-4">
              CLOCKWORK SUDOKU
            </h1>
            <p className="font-ornate text-lg text-muted-foreground max-w-2xl mx-auto">
              A mechanical puzzle of precision. Complete the medium grid with logic—no guesswork required.
            </p>
          </div>
          {!isGameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
            {/* Error message popup */}
            <AnimatePresence>
              {showError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-800 text-white py-3 px-6 rounded-lg shadow-xl z-20"
                >
                  {errorMessage}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Game and controls layout */}
            <div className="flex flex-row items-start justify-center gap-12">
              {/* Game section (left) */}
              <div>
                {/* Main Sudoku container */}
                <div className="w-[500px] h-[500px] bg-black/80 backdrop-blur-sm p-3 rounded-ornate shadow-glow relative overflow-hidden
                                   before:absolute before:inset-0 before:p-[2px] before:rounded-ornate before:content-['']
                                   before:bg-[radial-gradient(circle_at_top_left,rgba(255,0,0,0.6),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(180,0,0,0.5),transparent_65%),linear-gradient(135deg,#5b0000,#210000)]
                                   after:absolute after:inset-[2px] after:rounded-[calc(theme(borderRadius.lg)-2px)] after:bg-gradient-to-br after:from-black/90 after:to-neutral-900/90 after:content-['']">
                  <div className="grid grid-cols-3 grid-rows-3 gap-3 h-full w-full relative z-10 p-[2px]">
                    {Array(9).fill(null).map((_, boxIndex) => {
                      const boxRow = Math.floor(boxIndex / 3);
                      const boxCol = boxIndex % 3;

                      return (
                        <div
                          key={`box-${boxIndex}`}
                          className="grid grid-cols-3 grid-rows-3 gap-[2px] bg-neutral-950/60 relative overflow-hidden border border-red-700/40 rounded-md shadow-inner"
                        >
                          {Array(9).fill(null).map((_, cellIndex) => {
                            const cellRow = Math.floor(cellIndex / 3);
                            const cellCol = cellIndex % 3;
                            const rowIndex = boxRow * 3 + cellRow;
                            const colIndex = boxCol * 3 + cellCol;

                            if (!board[rowIndex] || board[rowIndex][colIndex] === undefined) {
                              return <div key={`empty-${rowIndex}-${colIndex}`} className="bg-black"></div>;
                            }

                            const num = board[rowIndex][colIndex];
                            const isPrefilled = prefilled[rowIndex][colIndex];
                            const status = cellStatus[rowIndex]?.[colIndex] || 'unfilled';
                            const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;

                            let cellColor = "";
                            if (isPrefilled) {
                              cellColor = "bg-gradient-to-br from-red-800 to-red-600 font-bold text-red-100 shadow-md";
                            } else if (num === 0) {
                              cellColor = "bg-neutral-900/70 text-red-400 hover:bg-neutral-800/80";
                            } else if (status === 'correct') {
                              cellColor = "bg-gradient-to-br from-neutral-800 to-neutral-700 text-red-200 shadow-inner";
                            } else if (status === 'incorrect') {
                              cellColor = "bg-gradient-to-br from-[#510000] to-[#7a0000] text-white animate-pulse";
                            }
                            
                            const cellStyle = isSelected ? "ring-2 ring-red-400 shadow-glow-sm" : "";

                            return (
                              <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={`relative w-full h-full border border-red-900/40 flex justify-center items-center text-2xl font-mono transition-colors duration-150 ${cellColor} ${cellStyle}
                                ${!isPrefilled ? 'cursor-pointer hover:border-red-500/60' : 'border-red-800/60'}`}
                                onClick={() => {
                                  if (!isPrefilled) {
                                    setSelectedCell({ row: rowIndex, col: colIndex });
                                  }
                                }}
                              >
                                {num !== 0 ? (
                                  <span className="relative z-10">{num}</span>
                                ) : (
                                  <div className="grid grid-cols-3 gap-[1px] text-[10px] leading-none text-red-500/60">
                                    {Array.from({ length: 9 }, (_, i) => i + 1).map((noteNum) => (
                                      <div key={noteNum} className="text-center">{notes[rowIndex]?.[colIndex]?.has(noteNum) ? noteNum : ''}</div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Controls section on the right */}
              <div className="flex flex-col items-center justify-between h-[500px] w-[240px] p-4 bg-black/60 backdrop-blur-sm rounded-ornate border border-red-900/40 shadow-glow-sm">
                {/* Top stats */}
                <div className="flex justify-between w-full text-red-300 font-ornate text-sm tracking-wide">
                  <div>Errors: <span className="font-bold">{errors}</span></div>
                  <div>Time: <span className="font-bold">{formatTime(timer * 1000)}</span></div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-around w-full gap-2">
                  <motion.button
                    onClick={handleUndo}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={history.length <= 1}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all relative overflow-hidden bg-[#3a0000] hover:bg-[#520000] text-red-200 disabled:opacity-30 disabled:cursor-not-allowed border border-red-900/60"
                  >
                    U
                  </motion.button>
                  <motion.button
                    onClick={handleErase}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!selectedCell || prefilled[selectedCell.row][selectedCell.col]}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all relative overflow-hidden bg-[#3a0000] hover:bg-[#520000] text-red-200 disabled:opacity-30 disabled:cursor-not-allowed border border-red-900/60"
                  >
                    E
                  </motion.button>
                  <motion.button
                    onClick={() => setNotesMode(!notesMode)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all relative overflow-hidden border border-red-900/60 ${notesMode ? 'bg-red-600 text-white shadow-glow-sm' : 'bg-[#3a0000] hover:bg-[#520000] text-red-200'}`}
                  >
                    N
                  </motion.button>
                  <motion.button
                    onClick={handleHint}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={hintsRemaining === 0 || !selectedCell || board[selectedCell.row][selectedCell.col] !== 0}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all relative overflow-hidden bg-[#3a0000] hover:bg-[#520000] text-red-200 disabled:opacity-30 disabled:cursor-not-allowed border border-red-900/60"
                  >
                    <div className="relative">
                      H
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {hintsRemaining}
                      </span>
                    </div>
                  </motion.button>
                </div>

                {/* Numpad 3x3 (Enhanced) */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {Array.from({ length: 9 }, (_, i) => i + 1).map(num => {
                    const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col] : 0;
                    const isPlacedSomewhere = board.some(r => r.includes(num));
                    const isSameAsSelected = selectedValue === num && selectedValue !== 0;
                    const isNoteCandidate = notesMode && selectedCell && notes[selectedCell.row][selectedCell.col].has(num);
                    const disabled = !!selectedCell && board[selectedCell.row][selectedCell.col] !== 0 && !notesMode;

                    return (
                      <motion.button
                        key={`number-${num}`}
                        onClick={() => !disabled && handleNumberClick(num)}
                        whileHover={{ scale: disabled ? 1 : 1.12, rotate: disabled ? 0 : 1 }}
                        whileTap={{ scale: disabled ? 1 : 0.92 }}
                        animate={ isSameAsSelected ? { boxShadow: '0 0 14px 3px rgba(255,0,0,0.55)' } : { boxShadow: '0 0 6px 0 rgba(120,0,0,0.4)' } }
                        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                        className={`relative group aspect-square flex items-center justify-center rounded-xl text-3xl font-bold select-none
                          border border-red-900/60 overflow-hidden
                          ${disabled ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer'}
                          ${notesMode ? 'bg-gradient-to-br from-[#5a0000] to-[#420000]' : 'bg-gradient-to-br from-[#2a0000] to-[#180000]'}
                          ${!disabled && 'hover:from-[#520000] hover:to-[#2a0000]'}
                          ${isSameAsSelected ? 'text-red-200' : 'text-red-100'}
                        `}
                      >
                        {/* Glow backdrop */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-radial-at-c from-red-600/60 to-transparent`} />
                        {/* Active ring */}
                        {isSameAsSelected && (
                          <div className="absolute inset-0 rounded-xl ring-2 ring-red-500/70 animate-pulse pointer-events-none" />
                        )}
                        {/* Note candidate indicator */}
                        {isNoteCandidate && !isSameAsSelected && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-600 shadow-[0_0_6px_2px_rgba(255,0,0,0.5)]" />
                        )}
                        {/* Frequency indicator bar (if number already placed somewhere) */}
                        {isPlacedSomewhere && !isSameAsSelected && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />
                        )}
                        <span className="relative z-10 drop-shadow-[0_0_4px_rgba(255,0,0,0.55)]">
                          {num}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* New Game Button */}
                <motion.button
                  onClick={handlePlayAgain}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                      className="w-full px-4 py-3 rounded-xl shadow-glow font-bold transition-all bg-gradient-to-r from-[#560000] via-[#7a0000] to-[#560000] hover:via-[#8a0000] text-red-100 text-lg border border-red-800/60"
                >
                  New Game
                </motion.button>
                <Link to="/catalog" className="w-full">
                  <OrnateButton variant="ghost" className="w-full mt-2">
                    Back to Catalogue
                  </OrnateButton>
                </Link>
              </div>
            </div>
          </motion.div>
          )}
          {isGameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 mx-auto max-w-xl bg-black/70 border-2 border-red-600 rounded-ornate shadow-glow p-10 text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent pointer-events-none" />
              <h2 className="font-steampunk text-4xl font-bold text-foreground glow-text mb-6">PUZZLE COMPLETE</h2>
              <div className="grid grid-cols-2 gap-4 font-ornate text-sm text-muted-foreground mb-8">
                <div className="p-3 border border-primary/30 rounded">
                  <div className="text-xs uppercase tracking-wider">Difficulty</div>
                  <div className="text-primary font-bold text-lg">Medium</div>
                </div>
                <div className="p-3 border border-primary/30 rounded">
                  <div className="text-xs uppercase tracking-wider">Time</div>
                  <div className="text-primary font-bold text-lg">{startTime && endTime ? formatTime(endTime - startTime) : '—'}</div>
                </div>
                <div className="p-3 border border-primary/30 rounded">
                  <div className="text-xs uppercase tracking-wider">Errors</div>
                  <div className="text-primary font-bold text-lg">{errors}</div>
                </div>
                <div className="p-3 border border-primary/30 rounded">
                  <div className="text-xs uppercase tracking-wider">Performance</div>
                  <div className="text-primary font-bold text-lg">
                    {errors === 0 ? 'Perfect' : errors <= 3 ? 'Excellent' : errors <= 8 ? 'Great' : 'Well Done'}
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <OrnateButton variant="hero" onClick={handlePlayAgain}>New Puzzle</OrnateButton>
                <Link to="/catalog"><OrnateButton variant="gear">Back to Catalogue</OrnateButton></Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};