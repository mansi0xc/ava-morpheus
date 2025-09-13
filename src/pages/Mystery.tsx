import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';

// Example avatar images (replace with your own assets if available)
import avatar1 from '@/assets/gear-ornament.png';
import avatar2 from '@/assets/gear-ornament.png';
// You can add more avatar images as needed

export const Mystery: React.FC = () => {
  const [selectedClue, setSelectedClue] = useState<number | null>(null);

  const mysteryNotes = [
    {
      id: 1,
      title: 'The Brass Key',
      content: 'Found beneath the great clock tower...',
      x: 20,
      y: 30,
      color: 'red',
      avatar: avatar1,
      character: 'Professor Cogsworth',
      description: 'A brilliant inventor known for his intricate clockwork devices and cryptic clues.'
    },
    {
      id: 2,
      title: 'Steam Patterns',
      content: 'The pipes spell out ancient symbols...',
      x: 60,
      y: 20,
      color: 'white',
      avatar: avatar2,
      character: 'Lady Gearhart',
      description: 'A mysterious engineer who deciphers the language of steam and gears.'
    },
    {
      id: 3,
      title: 'Gear Alignment',
      content: 'When all gears turn in harmony...',
      x: 30,
      y: 60,
      color: 'red',
      avatar: avatar1,
      character: 'Sir Brassington',
      description: 'A master mechanic with a knack for aligning even the most stubborn gears.'
    },
    {
      id: 4,
      title: 'The Clockmaker',
      content: 'His signature appears on every piece...',
      x: 70,
      y: 70,
      color: 'white',
      avatar: avatar2,
      character: 'The Clockmaker',
      description: 'A legendary artisan whose works are shrouded in secrecy.'
    },
    {
      id: 5,
      title: 'Hidden Chamber',
      content: 'Behind the largest gear lies a secret...',
      x: 50,
      y: 45,
      color: 'red',
      avatar: avatar1,
      character: 'Miss Valve',
      description: 'A daring explorer always searching for hidden chambers and lost treasures.'
    },
    {
      id: 6,
      title: 'Time Cipher',
      content: 'The clock hands point to more than time...',
      x: 80,
      y: 40,
      color: 'white',
      avatar: avatar2,
      character: 'Dr. Chronos',
      description: 'A timekeeper obsessed with unraveling the mysteries of time.'
    }
  ];

  const connections = [
    { from: 1, to: 3 },
    { from: 2, to: 5 },
    { from: 3, to: 5 },
    { from: 4, to: 6 },
    { from: 5, to: 6 }
  ];

  return (
    <div className="min-h-screen relative">        
      <SteampunkNavbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1
              className="text-5xl mb-6 text-white"
              style={{
                fontFamily: 'serif',
                textShadow: '0 0 20px #FFFFFF, 0 0 40px #E84142'
              }}
            >
              THE GREAT MYSTERY
            </h1>
            <div className="w-40 h-1 bg-gradient-to-r from-red-600 via-white to-red-600 mx-auto rounded-full"></div>
            {/* <p className="text-gray-300 mt-6 text-lg max-w-2xl mx-auto">
              Uncover the secrets hidden within the clockwork. Each clue leads to another piece of the puzzle.
            </p> */}
          </motion.div>

          {/* Storyline Description (moved outside the board, below headline) */}
          <motion.div
            className="max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-black/70 border-2 border-red-600 rounded-xl px-8 py-6 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(232,65,66,0.25), transparent 70%)' }}></div>
              <h2 className="text-2xl md:text-3xl text-red-600 mb-3 font-serif tracking-wide" style={{ textShadow: '0 0 12px #E84142' }}>
                Storyline
              </h2>
              <p className="text-gray-200 leading-relaxed font-serif text-base md:text-lg">
                In the heart of the brassbound metropolis, time itself feels engineered. Cryptic devices, vanished artisans, and clandestine alliances converge around the Great Clock. Each clue you uncover is a cog—turn it, and new mechanisms engage. Follow the trails, interrogate the relics, and unravel the conspiracy before the final chime resets more than the hour.
              </p>
            </div>
          </motion.div>

          {/* Mystery Board */}
          <motion.div
            className="relative bg-black border-4 border-red-600 rounded-lg p-8 h-[600px] overflow-hidden shadow-2xl shadow-red-600/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Corner Decorations */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-red-600 rounded-full shadow-lg shadow-red-600/50"></div>
            <div className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full shadow-lg shadow-white/50"></div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-white rounded-full shadow-white/50"></div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-red-600 rounded-full shadow-lg shadow-red-600/50"></div>

            {/* Glowing Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-white/5 rounded-lg"></div>

            {/* Connection Lines (background, below notes) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="connGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E84142" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#E84142" />
                </linearGradient>
                <linearGradient id="connGradientActive" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffb3b3" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#ffb3b3" />
                </linearGradient>
                <linearGradient id="connRedCore" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7a1012" />
                  <stop offset="45%" stopColor="#ff3a40" />
                  <stop offset="55%" stopColor="#ffa3a7" />
                  <stop offset="100%" stopColor="#7a1012" />
                </linearGradient>
                <filter id="glowPulse" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="outerRedGlow" x="-70%" y="-70%" width="240%" height="240%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {connections.map((connection, index) => {
                const fromNote = mysteryNotes.find(note => note.id === connection.from);
                const toNote = mysteryNotes.find(note => note.id === connection.to);
                if (!fromNote || !toNote) return null;

                const x1 = fromNote.x;
                const y1 = fromNote.y;
                const x2 = toNote.x;
                const y2 = toNote.y;
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;
                const dx = y2 - y1;
                const dy = x1 - x2;
                const norm = Math.sqrt(dx * dx + dy * dy) || 1;
                const offset = 12;
                const cx = mx + (dx / norm) * offset;
                const cy = my + (dy / norm) * offset;

                // Use numeric coordinates within 0-100 SVG viewBox space so lines are visible across browsers
                const path = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
                const isActive = selectedClue !== null && (connection.from === selectedClue || connection.to === selectedClue);

                return (
                  <motion.g
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, -0.35, 0.25, 0] }}
                    transition={{
                      opacity: { duration: 0.9, delay: index * 0.08 },
                      y: { duration: 6.5 + index * 0.25, repeat: Infinity, ease: 'easeInOut' }
                    }}
                  >
                    {/* Outer wide faint glow */}
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={isActive ? '#ff4d55' : '#b62227'}
                      strokeWidth={isActive ? 2.2 : 1.6}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: isActive ? 0.28 : 0.18 }}
                      transition={{ duration: 1.05, delay: index * 0.1 }}
                      style={{ filter: 'url(#outerRedGlow)' }}
                    />
                    {/* Core glow (very thin) */}
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={isActive ? '#ff8388' : '#E84142'}
                      strokeWidth={isActive ? 1.1 : 0.85}
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: isActive ? 0.5 : 0.35 }}
                      transition={{ duration: 0.9, delay: 0.05 + index * 0.1 }}
                      style={{ filter: 'blur(1.2px)' }}
                    />
                    {/* Razor core gradient line */}
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={`url(#${isActive ? 'connGradientActive' : 'connRedCore'})`}
                      strokeWidth={isActive ? 0.65 : 0.5}
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.1, delay: 0.08 + index * 0.12 }}
                      style={{ filter: 'drop-shadow(0 0 4px #ff454b)' }}
                    />
                    {/* Animated ember pulses along line (dashed overlay) */}
                    <motion.path
                      d={path}
                      fill="none"
                      stroke={isActive ? '#fff4f4' : '#ffd2d2'}
                      strokeWidth={isActive ? 0.45 : 0.38}
                      strokeDasharray="4 14"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, strokeDashoffset: 60, opacity: 0 }}
                      animate={{ pathLength: 1, strokeDashoffset: -200, opacity: isActive ? 0.85 : 0.4 }}
                      transition={{
                        pathLength: { duration: 0.95, delay: 0.15 + index * 0.1 },
                        strokeDashoffset: { duration: 5.5, repeat: Infinity, ease: 'linear' }
                      }}
                      style={{ mixBlendMode: 'screen' }}
                    />
                    {/* Endpoint nodes */}
                    {[{ x: x1, y: y1 }, { x: x2, y: y2 }].map((pt, i) => (
                      <motion.circle
                        key={i}
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? 1.9 : 1.5}
                        fill={isActive ? '#ffffff' : '#ff5d63'}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.9, 0.1] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: (index * 0.09) + i * 0.28 }}
                        style={{ filter: 'drop-shadow(0 0 5px #ff5259)' }}
                      />
                    ))}
                  </motion.g>
                );
              })}
            </svg>

            {/* Responsive grid for notes to fill the board (z-10 to be above lines) */}
            <div className="absolute inset-0 w-full h-full z-10">
              {mysteryNotes.map((note, index) => {
                const tilt = ((index % 2 === 0) ? -6 : 6) * (Math.random() > 0.5 ? 1 : -1);
                return (
                  <div
                    key={note.id}
                    className="absolute"
                    style={{
                      left: `${note.x}%`,
                      top: `${note.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <motion.div
                      className="cursor-pointer"
                      style={{
                        width: 'clamp(120px, 10vw, 200px)',
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      whileHover={{ scale: 1.07, rotate: 4 }}
                      onClick={() => setSelectedClue(note.id)}
                    >
                      <div
                        className={`relative w-full bg-black border-4 ${
                          note.color === 'red' ? 'border-red-600' : 'border-white'
                        } rounded-xl p-4 shadow-lg hover:rotate-0 transition-all duration-300 ${
                          selectedClue === note.id ? 'scale-110 z-20' : ''
                        }`}
                        style={{ transform: `rotate(${tilt}deg)` }}
                      >
                        {/* Avatar */}
                        <img
                          src={note.avatar}
                          alt={note.character}
                          className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white shadow-lg bg-black object-cover z-20"
                        />
                        {/* Steampunk Bolt */}
                        <div
                          className={`absolute -top-3 -right-3 w-7 h-7 bg-gray-700 border-2 ${
                            note.color === 'red' ? 'border-red-600' : 'border-white'
                          } rounded-full flex items-center justify-center shadow-md`}
                          style={{ boxShadow: note.color === 'red' ? '0 0 8px #E84142' : '0 0 8px #fff' }}
                        >
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-8">
                          <h3
                            className={`text-lg mb-2 ${
                              note.color === 'red' ? 'text-red-600' : 'text-white'
                            }`}
                            style={{ fontFamily: 'serif', textShadow: '0 0 10px currentColor' }}
                          >
                            {note.title}
                          </h3>
                          <p className="text-sm text-gray-400 leading-tight whitespace-pre-wrap break-words">
                            {note.content}
                          </p>
                        </div>

                        {/* Glowing Effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${
                            note.color === 'red' ? 'from-red-600/20' : 'from-white/20'
                          } to-transparent rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300`}
                        ></div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          {/* Popup for character details */}
          {selectedClue && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <motion.div
                className="bg-black border-4 border-red-600 rounded-2xl p-8 max-w-md w-full relative shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  className="absolute top-3 right-3 text-white text-2xl hover:text-red-600 focus:outline-none"
                  onClick={() => setSelectedClue(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="flex flex-col items-center">
                  <img
                    src={mysteryNotes.find(n => n.id === selectedClue)?.avatar}
                    alt={mysteryNotes.find(n => n.id === selectedClue)?.character}
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-black object-cover mb-4"
                  />
                  <h2 className="text-2xl text-red-600 mb-2" style={{ fontFamily: 'serif', textShadow: '0 0 10px #E84142' }}>
                    {mysteryNotes.find(n => n.id === selectedClue)?.character}
                  </h2>
                  <p className="text-white text-center text-lg mb-2">
                    {mysteryNotes.find(n => n.id === selectedClue)?.description}
                  </p>
                  <div className="w-16 h-1 bg-gradient-to-r from-red-600 via-white to-red-600 mx-auto rounded-full mb-2"></div>
                  <div className="text-gray-400 text-center text-base">
                    <span className="font-bold">Clue:</span> {mysteryNotes.find(n => n.id === selectedClue)?.title}
                  </div>
                </div>
              </motion.div>
            </div>
          )}          
          </motion.div>

          {/* Progress Indicator */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <div className="inline-flex items-center space-x-4 bg-black border-2 border-red-600 rounded-lg px-6 py-3">
              <span className="text-white" style={{ fontFamily: 'serif' }}>
                Mystery Progress:
              </span>
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-red-600 to-white"
                  initial={{ width: 0 }}
                  animate={{ width: '35%' }}
                  transition={{ duration: 2, delay: 2.5 }}
                  style={{ boxShadow: '0 0 10px #E84142' }}
                />
              </div>
              <span
                className="text-red-600"
                style={{ fontFamily: 'serif', textShadow: '0 0 10px #E84142' }}
              >
                35%
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Mystery;
  