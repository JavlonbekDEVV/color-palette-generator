import type { HarmonyType, PaletteColor } from '@/types';

export interface HSL {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGB {
  r: number; // 0-255
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (v: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(v)));
    return clamped.toString(16).padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToHsl(hex: string): HSL {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl({ r, g, b });
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta) % 6;
    } else if (max === gn) {
      h = (bn - rn) / delta + 2;
    } else {
      h = (rn - gn) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let rp = 0,
    gp = 0,
    bp = 0;
  if (h < 60) [rp, gp, bp] = [c, x, 0];
  else if (h < 120) [rp, gp, bp] = [x, c, 0];
  else if (h < 180) [rp, gp, bp] = [0, c, x];
  else if (h < 240) [rp, gp, bp] = [0, x, c];
  else if (h < 300) [rp, gp, bp] = [x, 0, c];
  else [rp, gp, bp] = [c, 0, x];

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  };
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

export function hslString({ h, s, l }: HSL): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

export function rgbString({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

/** Relative luminance for deciding readable text color on top of a swatch. */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function readableText(hex: string): '#FFFFFF' | '#1A1A1A' {
  return luminance(hex) > 0.45 ? '#1A1A1A' : '#FFFFFF';
}

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function clampH(h: number): number {
  return ((h % 360) + 360) % 360;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function hsl(h: number, s: number, l: number): HSL {
  return { h: clampH(h), s: clamp(s, 0, 100), l: clamp(l, 0, 100) };
}

/** Generate a single pleasant random color, biased toward usable saturation/lightness. */
function randomHsl(): HSL {
  return {
    h: rand(0, 360),
    s: rand(35, 78),
    l: rand(42, 68),
  };
}

export interface HarmonyResult {
  colors: HSL[];
}

/**
 * Generate a palette of `count` colors following the given harmony.
 * `seedHue` is used when the user is regenerating around a locked anchor color.
 */
export function generateHarmony(
  harmony: HarmonyType,
  count: number,
  seedHue?: number,
): HSL[] {
  const baseHue = seedHue ?? rand(0, 360);

  switch (harmony) {
    case 'random': {
      const out: HSL[] = [];
      for (let i = 0; i < count; i++) out.push(randomHsl());
      return out;
    }

    case 'complementary': {
      const comp = clampH(baseHue + 180);
      // distribute across the base and its complement with varied lightness
      const positions: HSL[] = [
        hsl(baseHue, rand(40, 70), rand(48, 62)),
        hsl(baseHue, rand(35, 65), rand(38, 52)),
        hsl(baseHue, rand(30, 60), rand(68, 80)),
        hsl(comp, rand(45, 75), rand(45, 60)),
        hsl(comp, rand(35, 65), rand(35, 48)),
      ];
      return pickN(positions, count);
    }

    case 'analogous': {
      const spread = 30;
      const offsets = [0, spread, -spread, spread * 2, -spread * 2];
      const positions = offsets.map((off) =>
        hsl(baseHue + off, rand(40, 72), rand(45, 65)),
      );
      return pickN(positions, count);
    }

    case 'monochromatic': {
      // same hue, varied lightness + slight saturation shifts
      const lightnesses = [82, 66, 52, 38, 24];
      const positions = lightnesses.map((l) =>
        hsl(baseHue, rand(28, 55), l + rand(-3, 3)),
      );
      return pickN(positions, count);
    }

    case 'triadic': {
      const t1 = clampH(baseHue + 120);
      const t2 = clampH(baseHue + 240);
      const positions: HSL[] = [
        hsl(baseHue, rand(45, 72), rand(48, 62)),
        hsl(t1, rand(45, 72), rand(48, 62)),
        hsl(t2, rand(45, 72), rand(48, 62)),
        hsl(baseHue, rand(35, 60), rand(30, 42)),
        hsl(t1, rand(35, 60), rand(70, 82)),
      ];
      return pickN(positions, count);
    }

    default:
      return Array.from({ length: count }, randomHsl);
  }
}

function pickN(arr: HSL[], n: number): HSL[] {
  // keep deterministic-ish order then trim/pad
  if (n <= arr.length) return arr.slice(0, n);
  const out = arr.slice();
  while (out.length < n) out.push(randomHsl());
  return out;
}

/**
 * Regenerate a palette, preserving locked colors. Returns new PaletteColor[].
 * A locked color anchors the harmony's seed hue so non-locked slots stay related.
 */
export function regenerate(
  current: PaletteColor[],
  harmony: HarmonyType,
): PaletteColor[] {
  const lockedHsls = current
    .filter((c) => c.locked)
    .map((c) => hexToHsl(c.hex));

  const seedHue =
    lockedHsls.length > 0 ? lockedHsls[0].h : undefined;

  const generated = generateHarmony(harmony, current.length, seedHue);
  let genIdx = 0;

  return current.map((c) => {
    if (c.locked) return c;
    // skip a generated color that happens to duplicate a locked hue position
    const next = generated[genIdx++];
    return { hex: hslToHex(next), locked: false };
  });
}

/** Build an initial palette (no locks). */
export function initialPalette(count: number, harmony: HarmonyType): PaletteColor[] {
  const hsls = generateHarmony(harmony, count);
  return hsls.map((h) => ({ hex: hslToHex(h), locked: false }));
}
