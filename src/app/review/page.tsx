"use client";

import { useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";

export default function ReviewPage() {
  const [code, setCode] = useState("");

  return (
    <section>
      <h1>CodeSage - AI Code Reviewer</h1>
      <CodeEditor value={code} onChange={setCode} />
    </section>
  );
}
