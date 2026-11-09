const FEATURES = [
  {
    title: 'Harmony engine',
    body: 'Complementary, analogous, monochromatic and triadic algorithms generate genuinely related color schemes — not random hex strings.',
  },
  {
    title: 'Lock & refine',
    body: 'Lock the colors you love and regenerate the rest. Locked colors anchor the harmony so new picks stay in key.',
  },
  {
    title: 'Save & export',
    body: 'Build a personal collection stored in your browser, copy hex values in a click, and export any palette as a PNG.',
  },
];

export function About() {
  return (
    <section
      id="about"
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-neutral-100">
          About Palette
        </h2>
        <p className="mt-3 text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
          Palette is a focused tool for building color combinations that work.
          It pairs a minimalist workspace with a real color-harmony engine, so
          every generated palette feels considered rather than random.
        </p>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-canvas p-6 dark:bg-neutral-900"
          >
            <h3 className="text-sm font-semibold text-ink dark:text-neutral-100">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
