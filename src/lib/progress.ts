// Simple localStorage-based game progress tracking per wallet address.
// Key pattern: gp_<walletAddress>
// Stored as plain number (games played count).

export function getGamesPlayed(address?: string | null): number {
  if (!address) return 0;
  try {
    const raw = localStorage.getItem(progressKey(address));
    if (!raw) return 0;
    const num = parseInt(raw, 10);
    return isNaN(num) ? 0 : num;
  } catch {
    return 0;
  }
}

export function incrementGamesPlayed(address?: string | null): number {
  if (!address) return 0;
  try {
    const current = getGamesPlayed(address);
    const next = current + 1;
    localStorage.setItem(progressKey(address), String(next));
    // Fire a custom event so listeners (like CaseClues page) can refresh without reload
    window.dispatchEvent(new CustomEvent('gameProgressUpdated', { detail: { address, gamesPlayed: next } }));
    return next;
  } catch {
    return 0;
  }
}

function progressKey(address: string) {
  return `gp_${address.toLowerCase()}`;
}
