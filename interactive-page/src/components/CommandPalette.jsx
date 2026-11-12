import React from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

export const CommandPalette = () => {
  const { commandPalette } = useCourse();
  const { isOpen, query, setQuery, filteredItems, closePalette } = commandPalette;

  if (!isOpen) return null;

  return (
    <div
      onClick={closePalette}
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 px-4 pt-20 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
      >
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="mr-3 h-4 w-4 text-cyan-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to any module, unit, tool, dataset, or simulator..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={closePalette}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-96 divide-y divide-slate-800/60 overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching modules, units, or tools found.
            </div>
          ) : (
            filteredItems.map(({ id, type, title, subtitle, action }) => (
              <button
                key={id}
                onClick={() => {
                  action();
                  closePalette();
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-800/80"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-cyan-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
                      {type}
                    </span>
                    <span className="text-xs font-bold text-white sm:text-sm">{title}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-slate-400">
                    {subtitle}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
