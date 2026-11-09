import { useEffect, useState } from 'react';
import type { HarmonyType, PaletteColor, SavedPalette } from '@/types';
import { initialPalette } from '@/utils/color';
import {
  loadCollections,
  saveCollections,
  loadTheme,
  saveTheme,
} from '@/utils/storage';
import { useToast } from '@/hooks/useToast';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { PaletteGenerator } from '@/components/PaletteGenerator';
import { Collections } from '@/components/Collections';
import { Explore } from '@/components/Explore';
import { About } from '@/components/About';
import { Footer } from '@/components/Footer';
import { Toast } from '@/components/Toast';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadTheme());
  const [harmony, setHarmony] = useState<HarmonyType>('random');
  const [count, setCount] = useState(5);
  const [palette, setPalette] = useState<PaletteColor[]>(() =>
    initialPalette(5, 'random'),
  );
  const [collections, setCollections] = useState<SavedPalette[]>(() =>
    loadCollections(),
  );

  const { toast, showToast, dismiss } = useToast();
  const notify = showToast;

  // apply + persist theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    saveTheme(theme);
  }, [theme]);

  // persist collections
  useEffect(() => {
    saveCollections(collections);
  }, [collections]);

  // resize palette when count changes (preserve locked colors)
  useEffect(() => {
    setPalette((prev) => {
      if (prev.length === count) return prev;
      if (prev.length > count) {
        let remaining = prev.slice();
        while (remaining.length > count) {
          const revIdx = [...remaining]
            .reverse()
            .findIndex((c) => !c.locked);
          if (revIdx === -1) break;
          const idx = remaining.length - 1 - revIdx;
          remaining = [
            ...remaining.slice(0, idx),
            ...remaining.slice(idx + 1),
          ];
        }
        remaining = remaining.slice(0, count);
        while (remaining.length < count) {
          remaining = [...remaining, { hex: '#A3B18A', locked: false }];
        }
        return remaining;
      }
      const additions = initialPalette(count - prev.length, harmony);
      return [...prev, ...additions];
    });
  }, [count, harmony]);

  const toggleTheme = () =>
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const scrollTo = (id: string) => {
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const savePalette = () => {
    const newPalette: SavedPalette = {
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: `Palette ${collections.length + 1}`,
      colors: palette.map((c) => c.hex),
      createdAt: Date.now(),
    };
    setCollections((prev) => [newPalette, ...prev]);
    notify('Palette saved');
  };

  const renamePalette = (id: string, name: string) => {
    setCollections((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name } : p)),
    );
  };

  const deletePalette = (id: string) => {
    setCollections((prev) => prev.filter((p) => p.id !== id));
    notify('Palette deleted');
  };

  return (
    <div className="min-h-screen bg-canvas text-ink dark:bg-neutral-900 dark:text-neutral-100">
      <Header theme={theme} onToggleTheme={toggleTheme} onNavigate={scrollTo} />

      <main>
        <Hero />

        <PaletteGenerator
          harmony={harmony}
          onHarmonyChange={setHarmony}
          count={count}
          onCountChange={setCount}
          palette={palette}
          setPalette={setPalette}
          onSave={savePalette}
          notify={notify}
        />

        <Collections
          palettes={collections}
          onRename={renamePalette}
          onDelete={deletePalette}
          notify={notify}
        />

        <Explore notify={notify} />

        <About />
      </main>

      <Footer />

      {toast && (
        <Toast message={toast.message} onDismiss={dismiss} />
      )}
    </div>
  );
}
