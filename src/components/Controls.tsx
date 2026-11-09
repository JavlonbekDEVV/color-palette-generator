import { Shuffle } from 'lucide-react';
import type { HarmonyType } from '@/types';
import { HARMONY_LABELS } from '@/types';

interface ControlsProps {
  harmony: HarmonyType;
  onHarmonyChange: (h: HarmonyType) => void;
  count: number;
  onCountChange: (c: number) => void;
  onGenerate: () => void;
}

const HARMONIES: HarmonyType[] = [
  'random',
  'complementary',
  'analogous',
  'monochromatic',
  'triadic',
];

const COUNTS = [3, 4, 5];

function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  render,
  ariaLabel,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  render: (v: T) => string;
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
    >
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={String(opt)}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt)}
            className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-ink text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900'
                : 'text-neutral-500 hover:text-ink dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            {render(opt)}
          </button>
        );
      })}
    </div>
  );
}

export function Controls({
  harmony,
  onHarmonyChange,
  count,
  onCountChange,
  onGenerate,
}: ControlsProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <SegmentedControl
          ariaLabel="Color harmony"
          options={HARMONIES}
          value={harmony}
          onChange={onHarmonyChange}
          render={(h) => HARMONY_LABELS[h]}
        />

        <span className="hidden h-6 w-px bg-neutral-200 dark:bg-neutral-700 sm:block" />

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
            Colors
          </span>
          <SegmentedControl
            ariaLabel="Number of colors"
            options={COUNTS}
            value={count}
            onChange={onCountChange}
            render={(c) => String(c)}
          />
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onGenerate}
          className="group inline-flex items-center gap-2.5 rounded-xl bg-ink px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 ease-smooth hover:shadow-lift hover:scale-[1.02] active:scale-[0.99] dark:bg-neutral-100 dark:text-neutral-900"
        >
          <Shuffle
            size={17}
            strokeWidth={2.25}
            className="transition-transform duration-500 ease-smooth group-hover:rotate-180"
          />
          Generate Palette
        </button>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500">
          <span className="flex items-center gap-1 rounded-md border border-neutral-200 px-1.5 py-0.5 font-mono text-[11px] font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
            SPACE
          </span>
          to generate
        </div>
      </div>
    </div>
  );
}