"use client";

import { Editor } from "@monaco-editor/react";

type CodeEditorPropes = {
  value: string;
  onChange: (value: string) => void;
};

// Editor showing code
export default function CodeEditor({ value, onChange }: CodeEditorPropes) {
  return (
    <Editor
      height="400px"
      language="javascript"
      theme="vs-dark"
      value={value}
      onChange={(val) => onChange(val ?? "")}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
      }}
    />
  );
}
