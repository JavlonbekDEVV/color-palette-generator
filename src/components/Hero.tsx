export function Hero() {
  return (
    <section
      id="top"
      className="mx-auto max-w-7xl px-5 pt-16 pb-10 text-center sm:px-8 sm:pt-24 sm:pb-14"
    >
      <div className="animate-fade-in-up">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3.5 py-1.5 text-xs font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          Color harmony engine
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl md:text-6xl dark:text-neutral-100">
          Find your perfect colors.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-500 sm:text-lg dark:text-neutral-400">
          Create, explore and save beautiful color combinations.
        </p>
      </div>
    </section>
  );
}
