"use client";

import { Editor } from "@monaco-editor/react";

type CodeEditorPropes = {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
};

const languageMap: Record<string, string> = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  Java: "java",
  "C++": "cpp",
};

export default function CodeEditor({
  value,
  onChange,
  language = "JavaScript",
  height = "460px",
}: CodeEditorPropes) {
  return (
    <Editor
      height={height}
      language={languageMap[language] ?? "javascript"}
      loading={
        <div className="flex h-full w-full items-center justify-center bg-slate-950 text-slate-100">
          <div className="flex w-full max-w-3xl flex-col gap-4 px-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 animate-pulse rounded-full bg-rose-400" />
              <span className="h-3 w-3 animate-pulse rounded-full bg-amber-400 [animation-delay:120ms]" />
              <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400 [animation-delay:240ms]" />
            </div>
            <div className="space-y-3">
              <div className="h-4 w-40 animate-pulse rounded bg-slate-800" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-800/90" />
              <div className="h-4 w-11/12 animate-pulse rounded bg-slate-800/80" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-slate-800/70" />
              <div className="h-4 w-3/5 animate-pulse rounded bg-slate-800/60" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Loading editor workspace...
            </p>
          </div>
        </div>
      }
      theme="vs-dark"
      value={value}
      onChange={(val) => onChange(val ?? "")}
      options={{
        fontSize: 15,
        minimap: { enabled: false },
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        wordWrap: "on",
        roundedSelection: true,
        automaticLayout: true,
      }}
    />
  );
}
