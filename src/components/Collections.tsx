import { useState } from 'react';
import { Check, Copy, Pencil, Trash2, X } from 'lucide-react';
import type { SavedPalette } from '@/types';
import { copyToClipboard } from '@/hooks/useToast';
import { PaletteStrip } from './PaletteStrip';

interface CollectionsProps {
  palettes: SavedPalette[];
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  notify: (msg: string) => void;
}

export function Collections({
  palettes,
  onRename,
  onDelete,
  notify,
}: CollectionsProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const startEdit = (p: SavedPalette) => {
    setEditingId(p.id);
    setDraftName(p.name);
  };

  const commitEdit = () => {
    if (editingId) {
      const name = draftName.trim() || 'Untitled';
      onRename(editingId, name);
      notify('Palette renamed');
    }
    setEditingId(null);
    setDraftName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraftName('');
  };

  const copyAll = async (p: SavedPalette) => {
    const ok = await copyToClipboard(p.colors.join(' '));
    notify(ok ? 'Palette copied' : 'Copy failed');
  };

  return (
    <section
      id="collections"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-neutral-100">
            My Collections
          </h2>
          <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
            {palettes.length === 0
              ? 'Saved palettes will appear here.'
              : `${palettes.length} saved palette${palettes.length === 1 ? '' : 's'}`}
          </p>
        </div>
      </div>

      {palettes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white/50 px-6 py-16 text-center dark:border-neutral-700 dark:bg-neutral-800/30">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500">
            <Copy size={20} />
          </div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
            No saved palettes yet
          </p>
          <p className="mt-1 max-w-sm text-sm text-neutral-400 dark:text-neutral-500">
            Generate a palette above and hit “Save palette” to start your
            collection.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {palettes.map((p) => (
            <div
              key={p.id}
              className="group rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-300 ease-smooth hover:shadow-soft dark:border-neutral-800 dark:bg-neutral-800/50"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                {editingId === p.id ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      autoFocus
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      className="flex-1 rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-sm font-medium text-ink outline-none focus:border-ink dark:border-neutral-600 dark:bg-neutral-900 dark:text-neutral-100"
                      placeholder="Palette name"
                    />
                    <button
                      onClick={commitEdit}
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-ink text-white dark:bg-neutral-100 dark:text-neutral-900"
                      aria-label="Save name"
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                      aria-label="Cancel rename"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="truncate text-sm font-semibold text-ink dark:text-neutral-100">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      <button
                        onClick={() => copyAll(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-ink dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                        aria-label="Copy palette"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => startEdit(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-ink dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                        aria-label="Rename palette"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                        aria-label="Delete palette"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>

              <PaletteStrip
                colors={p.colors}
                onCopy={(hex) => hex && notify(`Copied ${hex}`)}
              />

              <p className="mt-2.5 text-[11px] text-neutral-400 dark:text-neutral-500">
                {p.colors.join(' · ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
