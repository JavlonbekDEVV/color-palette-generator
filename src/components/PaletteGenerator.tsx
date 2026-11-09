import { useCallback, useEffect } from 'react';
import { Download, Save, Copy as CopyIcon } from 'lucide-react';
import type { HarmonyType, PaletteColor } from '@/types';
import { regenerate } from '@/utils/color';
import { copyToClipboard } from '@/hooks/useToast';
import { exportPaletteAsPng } from '@/utils/exportPng';
import { ColorCard } from './ColorCard';
import { Controls } from './Controls';

interface PaletteGeneratorProps {
  harmony: HarmonyType;
  onHarmonyChange: (h: HarmonyType) => void;
  count: number;
  onCountChange: (c: number) => void;
  palette: PaletteColor[];
  setPalette: React.Dispatch<React.SetStateAction<PaletteColor[]>>;
  onSave: () => void;
  notify: (msg: string) => void;
}

export function PaletteGenerator({
  harmony,
  onHarmonyChange,
  count,
  onCountChange,
  palette,
  setPalette,
  onSave,
  notify,
}: PaletteGeneratorProps) {
  const generate = useCallback(() => {
    setPalette((prev) => regenerate(prev, harmony));
  }, [harmony, setPalette]);

  // SPACE to generate (when not focused on an interactive element)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      const target = e.target as HTMLElement | null;
      if (target) {
        const tag = target.tagName;
        if (
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'BUTTON' ||
          tag === 'SELECT' ||
          target.getAttribute('role') === 'button' ||
          target.isContentEditable
        ) {
          return;
        }
      }
      e.preventDefault();
      generate();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [generate]);

  const toggleLock = (index: number) => {
    setPalette((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, locked: !c.locked } : c,
      ),
    );
  };

  const changeColor = (index: number, hex: string) => {
    setPalette((prev) =>
      prev.map((c, i) => (i === index ? { ...c, hex } : c)),
    );
  };

  const copyOne = async (index: number) => {
    const ok = await copyToClipboard(palette[index].hex);
    notify(ok ? `Copied ${palette[index].hex}` : 'Copy failed');
  };

  const copyAll = async () => {
    const text = palette.map((c) => c.hex).join(' ');
    const ok = await copyToClipboard(text);
    notify(ok ? 'Palette copied' : 'Copy failed');
  };

  const exportPng = () => {
    exportPaletteAsPng(
      palette.map((c) => c.hex),
      'Palette',
    );
    notify('PNG downloaded');
  };

  return (
    <section id="generator" className="mx-auto max-w-7xl px-5 pb-6 sm:px-8">
      {/* palette row */}
      <div className="animate-palette-fade mb-8 flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide sm:gap-3 md:gap-4 md:[&>*]:flex-1">
        {palette.map((color, i) => (
          <ColorCard
            key={i}
            color={color}
            index={i}
            onToggleLock={() => toggleLock(i)}
            onChangeColor={(hex) => changeColor(i, hex)}
            onCopy={() => copyOne(i)}
          />
        ))}
      </div>

      {/* controls */}
      <div className="mb-6">
        <Controls
          harmony={harmony}
          onHarmonyChange={onHarmonyChange}
          count={count}
          onCountChange={onCountChange}
          onGenerate={generate}
        />
      </div>

      {/* secondary actions */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100"
        >
          <Save size={15} strokeWidth={2} />
          Save palette
        </button>
        <button
          onClick={copyAll}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100"
        >
          <CopyIcon size={15} strokeWidth={2} />
          Copy palette
        </button>
        <button
          onClick={exportPng}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100"
        >
          <Download size={15} strokeWidth={2} />
          Export PNG
        </button>
      </div>
    </section>
  );
}
