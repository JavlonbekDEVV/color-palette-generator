import { useRef } from 'react';
import { Lock, Unlock, Copy } from 'lucide-react';
import type { PaletteColor } from '@/types';
import { hexToRgb, readableText } from '@/utils/color';

interface ColorCardProps {
  color: PaletteColor;
  index: number;
  onToggleLock: () => void;
  onChangeColor: (hex: string) => void;
  onCopy: () => void;
}

export function ColorCard({
  color,
  index,
  onToggleLock,
  onChangeColor,
  onCopy,
}: ColorCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textColor = readableText(color.hex);
  const isDark = textColor === '#FFFFFF';
  const rgb = hexToRgb(color.hex);

  const handleSwatchClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className="group relative flex h-72 flex-1 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-neutral-200/70 transition-all duration-300 ease-smooth hover:shadow-lift dark:border-neutral-800/70 sm:h-80 md:h-[26rem] min-w-[140px]"
      style={{ backgroundColor: color.hex }}
      onClick={handleSwatchClick}
      role="button"
      tabIndex={0}
      aria-label={`Color ${color.hex}, click to change`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSwatchClick();
        }
      }}
    >
      <input
        ref={inputRef}
        type="color"
        value={color.hex}
        onChange={(e) => onChangeColor(e.target.value.toUpperCase())}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label="Pick a color"
        tabIndex={-1}
      />

      {/* lock button */}
      <div className="flex justify-end p-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLock();
          }}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
            color.locked
              ? 'backdrop-blur-sm'
              : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{
            backgroundColor: color.locked
              ? isDark
                ? 'rgba(255,255,255,0.18)'
                : 'rgba(0,0,0,0.12)'
              : 'transparent',
            color: textColor,
          }}
          aria-label={color.locked ? 'Unlock color' : 'Lock color'}
          aria-pressed={color.locked}
        >
          {color.locked ? (
            <Lock size={16} strokeWidth={2.25} />
          ) : (
            <Unlock size={16} strokeWidth={2.25} />
          )}
        </button>
      </div>

      {/* info block */}
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between">
          <span
            className="font-mono text-sm font-semibold tracking-wide"
            style={{ color: textColor }}
          >
            {color.hex}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCopy();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ color: textColor }}
            aria-label={`Copy ${color.hex}`}
          >
            <Copy size={15} strokeWidth={2} />
          </button>
        </div>
        <span
          className="font-mono text-[11px] opacity-70"
          style={{ color: textColor }}
        >
          rgb({rgb.r}, {rgb.g}, {rgb.b})
        </span>
        <span
          className="mt-0.5 text-[11px] font-medium uppercase tracking-wider opacity-50"
          style={{ color: textColor }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
}
