/**
 * Render a palette as a PNG image and trigger a download.
 * Uses an offscreen canvas — no external dependencies.
 */
export function exportPaletteAsPng(
  colors: string[],
  name: string,
): void {
  const stripH = 400;
  const labelH = 96;
  const width = 1200;
  const height = stripH + labelH;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // background
  ctx.fillStyle = '#FAFAF8';
  ctx.fillRect(0, 0, width, height);

  // color strips
  const swatchW = width / colors.length;
  colors.forEach((hex, i) => {
    ctx.fillStyle = hex;
    ctx.fillRect(i * swatchW, 0, swatchW, stripH);

    // hex label inside the swatch
    const lum = luminance(hex);
    ctx.fillStyle = lum > 0.45 ? '#1A1A1A' : '#FFFFFF';
    ctx.font = '500 22px Inter, system-ui, sans-serif';
    ctx.textBaseline = 'alphabetic';
    const labelY = stripH - 28;
    ctx.fillText(hex.toUpperCase(), i * swatchW + 24, labelY);
  });

  // bottom label area
  ctx.fillStyle = '#FAFAF8';
  ctx.fillRect(0, stripH, width, labelH);
  ctx.fillStyle = '#202020';
  ctx.font = '600 30px Inter, system-ui, sans-serif';
  ctx.fillText(name, 32, stripH + 54);
  ctx.fillStyle = '#7A7A75';
  ctx.font = '400 18px Inter, system-ui, sans-serif';
  ctx.fillText('Generated with Palette', 32, stripH + 82);

  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = name.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase();
    a.download = `${safeName || 'palette'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

// local luminance to avoid a circular import in the browser bundle
function luminance(hex: string): number {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  const channel = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
