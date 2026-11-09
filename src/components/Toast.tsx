import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <div
      className="animate-toast-in fixed bottom-8 left-1/2 z-50 flex items-center gap-3 rounded-full border border-neutral-200/80 bg-white px-5 py-3 shadow-lift dark:border-neutral-700/60 dark:bg-neutral-800"
      role="status"
      aria-live="polite"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300">
        <Check size={14} strokeWidth={2.5} />
      </span>
      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-100">
        {message}
      </span>
      <button
        onClick={onDismiss}
        className="ml-1 text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
