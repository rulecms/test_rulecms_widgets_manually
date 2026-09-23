import type { ReactNode } from "react";

type TestNotesProps = {
  title: string;
  details: ReactNode;
};

/** Collapsed by default. The summary is the only chrome above the widget. */
export function TestNotes({ title, details }: TestNotesProps) {
  return (
    <details className="border-b border-zinc-200 bg-zinc-50 text-xs leading-snug text-zinc-700">
      <summary className="cursor-pointer px-3 py-1">{title}</summary>
      <div className="px-3 pb-2 pl-7 whitespace-pre-wrap text-zinc-600">
        {details}
      </div>
    </details>
  );
}
