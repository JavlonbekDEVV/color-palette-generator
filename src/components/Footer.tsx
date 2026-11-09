export function Footer() {
  return (
    <footer className="border-t border-neutral-200/70 dark:border-neutral-800/70">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-8 sm:flex-row sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="grid grid-cols-2 gap-[2px]">
            <span className="h-2 w-2 rounded-[2px] bg-[#E8A857]" />
            <span className="h-2 w-2 rounded-[2px] bg-[#5C7552]" />
            <span className="h-2 w-2 rounded-[2px] bg-[#2A6F97]" />
            <span className="h-2 w-2 rounded-[2px] bg-[#B5654A]" />
          </span>
          <span className="text-sm font-semibold text-ink dark:text-neutral-200">
            Palette
          </span>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Built for finding colors that work together.
        </p>
      </div>
    </footer>
  );
}
