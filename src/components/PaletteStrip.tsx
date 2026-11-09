import { copyToClipboard } from '@/hooks/useToast';

interface PaletteStripProps {
  colors: string[];
  onCopy?: (hex: string) => void;
  rounded?: string;
}

/** Compact horizontal color strip. Click a swatch to copy its hex. */
export function PaletteStrip({
  colors,
  onCopy,
  rounded = 'rounded-lg',
}: PaletteStripProps) {
  const handleCopy = async (hex: string) => {
    const ok = await copyToClipboard(hex);
    onCopy?.(ok ? hex : '');
  };

  return (
    <div
      className={`flex h-12 w-full overflow-hidden ${rounded} border border-neutral-200/60 dark:border-neutral-800/60`}
    >
      {colors.map((hex, i) => (
        <button
          key={i}
          onClick={() => handleCopy(hex)}
          title={`Copy ${hex}`}
          className="flex-1 transition-transform duration-150 ease-smooth hover:scale-y-110 focus:outline-none"
          style={{ backgroundColor: hex }}
          aria-label={`Copy ${hex}`}
        />
      ))}
    </div>
  );
}
