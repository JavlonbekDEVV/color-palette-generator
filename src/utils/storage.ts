import type { SavedPalette } from '@/types';

const KEY = 'palette.collections.v1';
const THEME_KEY = 'palette.theme.v1';

export function loadCollections(): SavedPalette[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p) =>
        p &&
        typeof p.id === 'string' &&
        typeof p.name === 'string' &&
        Array.isArray(p.colors),
    );
  } catch {
    return [];
  }
}

export function saveCollections(palettes: SavedPalette[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(palettes));
  } catch {
    /* ignore quota errors */
  }
}

export function loadTheme(): 'light' | 'dark' {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}
