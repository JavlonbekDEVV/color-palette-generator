import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onNavigate: (id: string) => void;
}

const NAV = [
  { id: 'generator', label: 'Generator' },
  { id: 'explore', label: 'Explore' },
  { id: 'about', label: 'About' },
];

export function Header({ theme, onToggleTheme, onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNav = (id: string) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 bg-canvas/85 backdrop-blur-md dark:border-neutral-800/70 dark:bg-neutral-900/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => handleNav('top')}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Palette home"
        >
          <span className="flex h-7 w-7 items-center justify-center">
            <span className="grid grid-cols-2 gap-[2px]">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#E8A857]" />
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#5C7552]" />
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#2A6F97]" />
              <span className="h-2.5 w-2.5 rounded-[3px] bg-[#B5654A]" />
            </span>
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-ink dark:text-neutral-100">
            Palette
          </span>
        </button>

        {/* desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-ink dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-ink dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <Moon size={17} strokeWidth={2} />
            ) : (
              <Sun size={17} strokeWidth={2} />
            )}
          </button>

          {/* mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <span className="flex flex-col gap-[5px]">
              <span
                className={`h-[2px] w-4 bg-current transition-transform ${
                  open ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              <span
                className={`h-[2px] w-4 bg-current transition-opacity ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`h-[2px] w-4 bg-current transition-transform ${
                  open ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* mobile nav drawer */}
      {open && (
        <nav className="border-t border-neutral-200/70 bg-canvas px-5 py-3 dark:border-neutral-800/70 dark:bg-neutral-900 md:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
