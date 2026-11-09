export type HarmonyType =
  | 'random'
  | 'complementary'
  | 'analogous'
  | 'monochromatic'
  | 'triadic';

export interface PaletteColor {
  hex: string;
  locked: boolean;
}

export interface SavedPalette {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
}

export interface CuratedPalette {
  name: string;
  category: string;
  colors: string[];
}

export const HARMONY_LABELS: Record<HarmonyType, string> = {
  random: 'Random',
  complementary: 'Complementary',
  analogous: 'Analogous',
  monochromatic: 'Monochromatic',
  triadic: 'Triadic',
};
