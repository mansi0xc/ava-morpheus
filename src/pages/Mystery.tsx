import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SteampunkNavbar } from '@/components/steampunk/SteampunkNavbar';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { abi, address as contractAddress } from '@/abi/MysteryCaseManager';
import { abi as userRegistryAbi, address as userRegistryAddress } from '@/abi/UserRegistry';
import { parseEther } from 'viem';


// Base fallback ornament (used if external avatar fails)
import ornament from '@/assets/gear-ornament.png';
// Import generated case content
// Using assertion to treat JSON as module; adjust tsconfig if needed
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import content from '@/content.json';
// You can add more avatar images as needed


export const Mystery: React.FC = () => {
 const [selectedClue, setSelectedClue] = useState<number | null>(null);
 const [isCreatingCase, setIsCreatingCase] = useState(false);
 const [isClosingCase, setIsClosingCase] = useState(false);
 const [isSubmittingVote, setIsSubmittingVote] = useState(false);
 const [isRegistering, setIsRegistering] = useState(false);
 const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);


 // Owner gating via tracked wallet (wagmi)
 const OWNER_ADDRESS = '0x603ab1b3e019f9b80ed0144d5abe68ebb1dc158a';
 const { address } = useAccount();
 const isOwner = (address ?? '').toLowerCase() === OWNER_ADDRESS;


 // Contract interaction hooks
 const { writeContract: writeCreateCase, data: createCaseHash, isPending: isCreateCasePending } = useWriteContract();
 const { writeContract: writeCloseCase, data: closeCaseHash, isPending: isCloseCasePending } = useWriteContract();
 const { writeContract: writeSubmitVote, data: submitVoteHash, isPending: isSubmitVotePending } = useWriteContract();
 const { writeContract: writeRegister, data: registerHash, isPending: isRegisterPending } = useWriteContract();

 // Read user registration status
 const { data: userRegistrationData, refetch: refetchRegistration } = useReadContract({
   address: userRegistryAddress as `0x${string}`,
   abi: userRegistryAbi,
   functionName: 'users',
   args: address ? [address] : undefined,
   query: { enabled: !!address }
 });

 const isUserRegistered = userRegistrationData ? (userRegistrationData as any)[0] : false;


 // Transaction receipt hooks
 const { isLoading: isCreateCaseLoading, isSuccess: isCreateCaseSuccess } = useWaitForTransactionReceipt({
   hash: createCaseHash,
 });
 const { isLoading: isCloseCaseLoading, isSuccess: isCloseCaseSuccess } = useWaitForTransactionReceipt({
   hash: closeCaseHash,
 });
 const { isLoading: isSubmitVoteLoading, isSuccess: isSubmitVoteSuccess } = useWaitForTransactionReceipt({
   hash: submitVoteHash,
 });
 const { isLoading: isRegisterLoading, isSuccess: isRegisterSuccess } = useWaitForTransactionReceipt({
   hash: registerHash,
 });


 // Handle create case
 const handleCreateCase = async () => {
   if (!address || isCreatingCase) return;
  
   setIsCreatingCase(true);
   try {
     // Example parameters for creating a case - you can make these dynamic later
     const description = caseData.title || "Mystery Case";
     const duration = 7 * 24 * 60 * 60; // 7 * 24 hours in seconds
     const correctAnswer = 1; // Example correct answer (0-255)
     const prizeAmount = parseEther("0.01"); // 0.01 ETH prize


     writeCreateCase({
       address: contractAddress as `0x${string}`,
       abi,
       functionName: 'createCase',
       args: [description, BigInt(duration), correctAnswer],
       value: prizeAmount,
     } as any);
   } catch (error) {
     console.error('Error creating case:', error);
     setIsCreatingCase(false);
   }
 };


 // Handle close case
 const handleCloseCase = async () => {
   if (!address || isClosingCase) return;
  
   setIsClosingCase(true);
   try {
     const caseId = 0; // Example case ID - you can make this dynamic
     const players: `0x${string}`[] = []; // Empty array for now - you can add players who participated


     writeCloseCase({
       address: contractAddress as `0x${string}`,
       abi,
       functionName: 'closeCase',
       args: [BigInt(caseId), players],
     } as any);
   } catch (error) {
     console.error('Error closing case:', error);
     setIsClosingCase(false);
   }
 };


 // Handle register
 const handleRegister = async () => {
   if (!address || isRegistering) return;
  
   setIsRegistering(true);
   try {
     writeRegister({
       address: userRegistryAddress as `0x${string}`,
       abi: userRegistryAbi,
       functionName: 'register',
       args: [],
     } as any);
   } catch (error) {
     console.error('Error registering:', error);
     setIsRegistering(false);
   }
 };

 // Handle submit vote
 const handleSubmitVote = async (suspectId: number) => {
   if (!address || isSubmittingVote) return;

   // Check if user is registered before allowing vote
   if (!isUserRegistered) {
     setShowRegistrationPrompt(true);
     return;
   }
  
   setIsSubmittingVote(true);
   try {
     const caseId = 0; // Example case ID - you can make this dynamic
     const answer = suspectId; // Use suspect ID as the answer


     writeSubmitVote({
       address: contractAddress as `0x${string}`,
       abi,
       functionName: 'submit',
       args: [BigInt(caseId), answer],
     } as any);
   } catch (error) {
     console.error('Error submitting vote:', error);
     setIsSubmittingVote(false);
   }
 };


 // Reset loading states when transactions complete
 React.useEffect(() => {
   if (isCreateCaseSuccess) {
     setIsCreatingCase(false);
   }
 }, [isCreateCaseSuccess]);


 React.useEffect(() => {
   if (isCloseCaseSuccess) {
     setIsClosingCase(false);
   }
 }, [isCloseCaseSuccess]);


 React.useEffect(() => {
   if (isSubmitVoteSuccess) {
     setIsSubmittingVote(false);
     // Close the popup after successful vote
     setSelectedClue(null);
   }
 }, [isSubmitVoteSuccess]);


 React.useEffect(() => {
   if (isRegisterSuccess) {
     setIsRegistering(false);
     setShowRegistrationPrompt(false);
     // Refetch registration status to update UI
     refetchRegistration();
   }
 }, [isRegisterSuccess, refetchRegistration]);


 // Extract data from imported JSON structure
 const caseData = (content as any).case || {};
 const victim = caseData.victim || {};
 const suspects = caseData.suspects || [];


 // Map suspects to board notes (reuse existing coordinates layout)
 const coordinates = [
   { x: 20, y: 30, color: 'red' },
   { x: 60, y: 20, color: 'white' },
   { x: 30, y: 60, color: 'red' },
   { x: 70, y: 70, color: 'white' },
   { x: 50, y: 45, color: 'red' },
   { x: 80, y: 40, color: 'white' }
 ];


 // Generate pseudo-random avatar URLs (DiceBear or similar public avatar service)
 const avatarSeeds = suspects.slice(0,6).map((s:any, i:number) => encodeURIComponent(`${s.name}-${i}-${s.age||'x'}`));
 const avatarUrls = avatarSeeds.map(seed => `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}&backgroundType=gradientLinear,solid&size=128`);


 const mysteryNotes = suspects.slice(0, 6).map((s: any, idx: number) => {
   const coord = coordinates[idx] || coordinates[0];
   return {
     id: s.id,
     title: s.name,
     content: s.background,
     full: s,
     avatar: avatarUrls[idx] || ornament,
     ...coord
   };
 });


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
         </motion.div>


         {/* Owner-only action */}
         {isOwner && (
           <div className="flex justify-end mb-6">
             <button
               onClick={handleCreateCase}
               disabled={isCreatingCase || isCreateCasePending || isCreateCaseLoading}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-600 text-white hover:bg-red-600/10 shadow-md hover:shadow-red-600/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
               aria-label="Create Case"
             >
               {(isCreatingCase || isCreateCasePending || isCreateCaseLoading) ? (
                 <>
                   <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                   <span>Creating...</span>
                 </>
               ) : (
                 <>
                   <span className="text-red-500 text-xl leading-none">+</span>
                   <span>Create Case</span>
                 </>
               )}
             </button>
           </div>
         )}


         {/* Storyline Description (moved outside the board, below headline) */}
         <motion.div
           className="max-w-3xl mx-auto mb-10"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.4 }}
         >
           <div className="bg-black/70 border-2 border-red-600 rounded-xl px-8 py-6 shadow-lg relative overflow-hidden">
             <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: 'radial-gradient(circle at 30% 20%, rgba(232,65,66,0.25), transparent 70%)' }}></div>
             <div className="uppercase tracking-[0.25em] text-xs text-red-400 mb-2 font-semibold">STORYLINE</div>
             <h2 className="text-2xl md:text-3xl text-red-600 mb-3 font-serif tracking-wide" style={{ textShadow: '0 0 12px #E84142' }}>
               {caseData.title || 'Case Title'}
             </h2>
             <p className="text-gray-200 leading-relaxed font-serif text-base md:text-lg mb-4">
               {caseData.shortDescription || 'No description available.'}
             </p>
             <div className="space-y-2 text-sm md:text-base font-serif text-gray-300">
               <div><span className="text-red-500 font-semibold">Victim:</span> {victim.name} ({victim.age}) – {victim.avaxRole}</div>
               <div className="text-gray-400 leading-relaxed">
                 {victim.background}
               </div>
             </div>
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
                         onError={(e) => { (e.currentTarget as HTMLImageElement).src = ornament; }}
                         alt={note.title}
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
                           {note.content?.length > 110 ? note.content.slice(0, 110) + '…' : note.content}
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
               {(() => {
                 const note = mysteryNotes.find(n => n.id === selectedClue);
                 if (!note) return null;
                 const s = note.full || {};
                 return (
                   <div className="flex flex-col items-center">
                     <img
                       src={note.avatar}
                       onError={(e) => { (e.currentTarget as HTMLImageElement).src = ornament; }}
                       alt={note.title}
                       className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-black object-cover mb-4"
                     />
                     <h2 className="text-2xl text-red-600 mb-2" style={{ fontFamily: 'serif', textShadow: '0 0 10px #E84142' }}>
                       {note.title}
                     </h2>
                     <div className="w-16 h-1 bg-gradient-to-r from-red-600 via-white to-red-600 mx-auto rounded-full mb-4" />
                     <div className="text-gray-200 text-sm space-y-2 font-serif text-left w-full">
                       <p><span className="text-red-500 font-semibold">Age:</span> {s.age}</p>
                       <p><span className="text-red-500 font-semibold">Background:</span> {s.background}</p>
                       <p><span className="text-red-500 font-semibold">Possible Motive:</span> {s.possibleMotive}</p>
                       {Array.isArray(s.educationalLinks) && s.educationalLinks.length > 0 && (
                         <div>
                           <p className="text-red-500 font-semibold mb-1">Educational Links:</p>
                           <ul className="list-disc list-inside space-y-1 text-gray-300">
                             {s.educationalLinks.map((l: any, i: number) => (
                               <li key={i} className="text-xs break-words">
                                 <span className="font-semibold">{l.term}:</span> <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-red-400 underline hover:text-red-300">{l.url}</a>
                                 {l.briefExplanation && (
                                   <span className="block text-[11px] text-gray-400 mt-0.5">{l.briefExplanation}</span>
                                 )}
                               </li>
                             ))}
                           </ul>
                         </div>
                       )}
                       {/* Vote as Culprit Button */}
                       {address && (
                         <div className="mt-6 pt-4 border-t border-red-600/30">
                           <button
                             onClick={() => handleSubmitVote(note.id)}
                             disabled={isSubmittingVote || isSubmitVotePending || isSubmitVoteLoading}
                             className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-serif font-semibold ${
                               isUserRegistered 
                                 ? 'border-red-600 bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white hover:shadow-red-600/40'
                                 : 'border-orange-500 bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-orange-500/40'
                             }`}
                           >
                             {(isSubmittingVote || isSubmitVotePending || isSubmitVoteLoading) ? (
                               <>
                                 <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                 <span>Submitting Vote...</span>
                               </>
                             ) : isUserRegistered ? (
                               <>
                                 <span className="text-xl leading-none">⚖️</span>
                                 <span>Vote as Culprit</span>
                               </>
                             ) : (
                               <>
                                 <span className="text-xl leading-none">📝</span>
                                 <span>Register to Vote</span>
                               </>
                             )}
                           </button>
                         </div>
                       )}
                     </div>
                   </div>
                 );
               })()}
             </motion.div>
           </div>
         )}

         {/* Registration Prompt Modal */}
         {showRegistrationPrompt && address && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
             <motion.div
               className="bg-black border-4 border-red-600 rounded-2xl p-8 max-w-md w-full relative shadow-2xl mx-4"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.3 }}
             >
               <button
                 className="absolute top-3 right-3 text-white text-2xl hover:text-red-600 focus:outline-none"
                 onClick={() => setShowRegistrationPrompt(false)}
                 aria-label="Close"
               >
                 &times;
               </button>
               
               <div className="text-center">
                 <div className="w-20 h-20 mx-auto mb-6 bg-red-600/20 rounded-full flex items-center justify-center border-2 border-red-600">
                   <span className="text-3xl">🔐</span>
                 </div>
                 
                 <h2 className="text-2xl text-red-600 mb-4 font-serif" style={{ textShadow: '0 0 10px #E84142' }}>
                   Registration Required
                 </h2>
                 
                 <div className="w-16 h-1 bg-gradient-to-r from-red-600 via-white to-red-600 mx-auto rounded-full mb-6" />
                 
                 <p className="text-gray-200 mb-6 font-serif leading-relaxed">
                   To participate in mystery cases and submit votes, you need to register your detective profile. 
                   This is a one-time setup that enables you to earn rewards and track your progress.
                 </p>
                 
                 <div className="space-y-4">
                   <button
                     onClick={handleRegister}
                     disabled={isRegistering || isRegisterPending || isRegisterLoading}
                     className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-red-600 bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-600/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-serif font-semibold"
                   >
                     {(isRegistering || isRegisterPending || isRegisterLoading) ? (
                       <>
                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         <span>Registering...</span>
                       </>
                     ) : (
                       <>
                         <span className="text-xl leading-none">📝</span>
                         <span>Register as Detective</span>
                       </>
                     )}
                   </button>
                   
                   <button
                     onClick={() => setShowRegistrationPrompt(false)}
                     className="w-full px-6 py-3 rounded-lg border-2 border-gray-600 text-gray-300 hover:bg-gray-600/10 transition-all duration-300 font-serif"
                   >
                     Maybe Later
                   </button>
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


     {/* Owner-only floating Close Case button (lower-right) */}
     {isOwner && (
       <button
         onClick={handleCloseCase}
         disabled={isClosingCase || isCloseCasePending || isCloseCaseLoading}
         className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full border-2 border-red-600 bg-black/80 text-white shadow-lg hover:bg-red-600/10 hover:shadow-red-600/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
         aria-label="Close Case"
       >
         {(isClosingCase || isCloseCasePending || isCloseCaseLoading) ? (
           <>
             <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="hidden sm:inline">Closing...</span>
           </>
         ) : (
           <>
             <span className="text-red-500 text-xl leading-none">×</span>
             <span className="hidden sm:inline">Close Case</span>
           </>
         )}
       </button>
     )}
   </div>
 );
};


export default Mystery;
