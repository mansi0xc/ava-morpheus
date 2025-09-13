import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import steampunkBg from '@/assets/steampunk-bg.jpg';

export const Mystery: React.FC = () => {
  const [selectedClue, setSelectedClue] = useState<number | null>(null);

  const mysteryNotes = [
    { id: 1, title: 'The Brass Key', content: 'Found beneath the great clock tower...', x: 20, y: 30, color: 'red' },
    { id: 2, title: 'Steam Patterns', content: 'The pipes spell out ancient symbols...', x: 60, y: 20, color: 'white' },
    { id: 3, title: 'Gear Alignment', content: 'When all gears turn in harmony...', x: 30, y: 60, color: 'red' },
    { id: 4, title: 'The Clockmaker', content: 'His signature appears on every piece...', x: 70, y: 70, color: 'white' },
    { id: 5, title: 'Hidden Chamber', content: 'Behind the largest gear lies a secret...', x: 50, y: 45, color: 'red' },
    { id: 6, title: 'Time Cipher', content: 'The clock hands point to more than time...', x: 80, y: 40, color: 'white' }
  ];

  const connections = [
    { from: 1, to: 3 },
    { from: 2, to: 5 },
    { from: 3, to: 5 },
    { from: 4, to: 6 },
    { from: 5, to: 6 }
  ];

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
            <p className="text-gray-300 mt-6 text-lg max-w-2xl mx-auto">
              Uncover the secrets hidden within the clockwork. Each clue leads to another piece of the puzzle.
            </p>
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

            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((connection, index) => {
                const fromNote = mysteryNotes.find(note => note.id === connection.from);
                const toNote = mysteryNotes.find(note => note.id === connection.to);
                if (!fromNote || !toNote) return null;

                return (
                  <motion.line
                    key={index}
                    x1={`${fromNote.x}%`}
                    y1={`${fromNote.y}%`}
                    x2={`${toNote.x}%`}
                    y2={`${toNote.y}%`}
                    stroke="#E84142"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 2, delay: index * 0.3 }}
                    style={{ filter: 'drop-shadow(0 0 5px #E84142)' }}
                  />
                );
              })}
            </svg>

            {/* Mystery Notes */}
            {mysteryNotes.map((note, index) => (
              <motion.div
                key={note.id}
                className="absolute cursor-pointer"
                style={{ left: `${note.x}%`, top: `${note.y}%` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                onClick={() => setSelectedClue(selectedClue === note.id ? null : note.id)}
              >
                <div
                  className={`relative w-32 h-32 bg-black border-3 ${
                    note.color === 'red' ? 'border-red-600' : 'border-white'
                  } rounded-lg p-3 shadow-lg transform rotate-3 hover:rotate-0 transition-all duration-300 ${
                    selectedClue === note.id ? 'scale-110 z-20' : ''
                  }`}
                >
                  {/* Corner Gear */}
                  <motion.div
                    className={`absolute -top-2 -right-2 w-6 h-6 border-2 ${
                      note.color === 'red' ? 'border-red-600' : 'border-white'
                    } rounded-full`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    style={{
                      background: `conic-gradient(from 0deg, transparent, ${
                        note.color === 'red' ? '#E84142' : '#FFFFFF'
                      }, transparent)`,
                      clipPath:
                        'polygon(50% 0%, 60% 35%, 100% 35%, 70% 57%, 85% 100%, 50% 75%, 15% 100%, 30% 57%, 0% 35%, 40% 35%)'
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <h3
                      className={`text-sm mb-2 ${
                        note.color === 'red' ? 'text-red-600' : 'text-white'
                      }`}
                      style={{ fontFamily: 'serif', textShadow: '0 0 10px currentColor' }}
                    >
                      {note.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-tight">{note.content}</p>
                  </div>

                  {/* Glowing Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      note.color === 'red' ? 'from-red-600/20' : 'from-white/20'
                    } to-transparent rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300`}
                  ></div>
                </div>
              </motion.div>
            ))}

            {/* Central Mystery Symbol */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
            >
              <div className="relative w-20 h-20">
                <motion.div
                  className="w-full h-full border-4 border-red-600 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  style={{
                    background: `conic-gradient(from 0deg, transparent, #E84142, transparent)`,
                    clipPath:
                      'polygon(50% 0%, 60% 35%, 100% 35%, 70% 57%, 85% 100%, 50% 75%, 15% 100%, 30% 57%, 0% 35%, 40% 35%)'
                  }}
                />
                <motion.div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-3 border-white rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  style={{
                    background: `conic-gradient(from 0deg, transparent, #FFFFFF, transparent)`,
                    clipPath:
                      'polygon(50% 0%, 60% 35%, 100% 35%, 70% 57%, 85% 100%, 50% 75%, 15% 100%, 30% 57%, 0% 35%, 40% 35%)'
                  }}
                />
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-red-600"
                  style={{ fontFamily: 'serif', textShadow: '0 0 10px #E84142' }}
                >
                  ?
                </div>
              </div>
            </motion.div>
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
  