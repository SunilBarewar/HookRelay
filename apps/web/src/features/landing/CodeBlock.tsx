interface CodeBlockProps {
  title: string;
  children: string;
}

export function CodeBlock({ title, children }: CodeBlockProps) {
  return (
    <figure className="overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-xl">
      <figcaption className="border-b border-white/10 px-4 py-2.5 text-xs font-medium text-slate-400">
        {title}
      </figcaption>
      {/* Focusable so keyboard users can scroll long lines. */}
      <pre
        tabIndex={0}
        aria-label={title}
        className="overflow-x-auto p-4 text-[13px] leading-6 text-slate-200 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-400"
      >
        <code className="font-mono">{children}</code>
      </pre>
    </figure>
  );
}
