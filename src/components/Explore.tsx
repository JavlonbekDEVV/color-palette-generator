import { useMemo, useState } from 'react';
import { Copy } from 'lucide-react';
import { CURATED_PALETTES } from '@/data/curatedPalettes';
import { copyToClipboard } from '@/hooks/useToast';
import { PaletteStrip } from './PaletteStrip';

interface ExploreProps {
  notify: (msg: string) => void;
}

const CATEGORIES = ['All', 'Minimal', 'Nature', 'Pastel', 'Warm', 'Cool'];

export function Explore({ notify }: ExploreProps) {
  const [active, setActive] = useState('All');

  const filtered = useMemo(() => {
    if (active === 'All') return CURATED_PALETTES;
    return CURATED_PALETTES.filter((p) => p.category === active);
  }, [active]);

  const copyPalette = async (name: string, colors: string[]) => {
    const ok = await copyToClipboard(colors.join(' '));
    notify(ok ? `Copied “${name}”` : 'Copy failed');
  };

  return (
    <section
      id="explore"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-neutral-100">
          Explore
        </h2>
        <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
          A curated collection of color combinations to get you started.
        </p>
      </div>

      {/* category filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
              active === cat
                ? 'bg-ink text-white dark:bg-neutral-100 dark:text-neutral-900'
                : 'border border-neutral-200 bg-white text-neutral-500 hover:border-neutral-300 hover:text-ink dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p.name}
            className="group rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 ease-smooth hover:shadow-soft dark:border-neutral-800 dark:bg-neutral-800/50"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-ink dark:text-neutral-100">
                  {p.name}
                </h3>
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  {p.category}
                </span>
              </div>
              <button
                onClick={() => copyPalette(p.name, p.colors)}
                className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-neutral-100 hover:text-ink dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                aria-label={`Copy ${p.name} palette`}
              >
                <Copy size={15} />
              </button>
            </div>

            <PaletteStrip
              colors={p.colors}
              onCopy={(hex) => hex && notify(`Copied ${hex}`)}
              rounded="rounded-xl"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
