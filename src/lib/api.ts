// src/lib/api.ts
const ROOT = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8081').replace(/\/$/, '');
const API = `${ROOT}/api/v1`;

export const API_BASE = ROOT; // exported in case you use it elsewhere

// ---------- Types ----------
export type ActivityPayload = {
  walletAddress: string;
  action: string;           // e.g., "Solved"
  puzzleName: string;       // e.g., "Clockwork Sudoku"
  difficulty: string;
  timeTakenMillis: number;
  errors: number;
  performance: string;      // e.g., "Perfect"
};

export type Activity = ActivityPayload & {
  id?: string;
  createdAt: string;        // ISO timestamp from backend
};

export type ProfilePayload = {
  walletAddress: string;
  name: string;
  location: string;
};

export type Profile = ProfilePayload & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

// ---------- Helpers ----------
async function jsonFetch<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const raw = await res.text();
  let data: any = null;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!res.ok) {
    const msg = (data && typeof data === 'object' && 'message' in data)
      ? String((data as any).message)
      : `${res.status} ${res.statusText}`;
    throw new Error(msg);
  }
  return data as T;
}

// ---------- Activities ----------
export async function postActivity(payload: ActivityPayload, signal?: AbortSignal): Promise<Activity> {
  return jsonFetch<Activity>(`${API}/activities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
}

// GET /api/v1/activities?wallet=...&limit=...&action=...&puzzle=...
export async function getRecentActivities(
  walletAddress: string,
  opts: { limit?: number; action?: string; puzzle?: string } = {},
  signal?: AbortSignal
): Promise<Activity[]> {
  const params = new URLSearchParams({
    wallet: walletAddress,
    limit: String(opts.limit ?? 10),
  });
  if (opts.action) params.append('action', opts.action);
  if (opts.puzzle) params.append('puzzle', opts.puzzle);

  return jsonFetch<Activity[]>(`${API}/activities?${params.toString()}`, { signal });
}

// ---------- Profiles ----------
export async function upsertProfile(payload: ProfilePayload, signal?: AbortSignal): Promise<Profile> {
  return jsonFetch<Profile>(`${API}/profiles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });
}

// Optional convenience: fetch a profile by wallet
export async function getProfile(walletAddress: string, signal?: AbortSignal): Promise<Profile | null> {
  const params = new URLSearchParams({ wallet: walletAddress });
  return jsonFetch<Profile | null>(`${API}/profiles?${params.toString()}`, { signal });
}
