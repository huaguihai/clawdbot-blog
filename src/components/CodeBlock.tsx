"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { Copy, Check } from "lucide-react";

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (typeof node === "object" && "props" in node) {
    return extractText((node as any).props.children);
  }
  return "";
}

function extractLanguage(node: ReactNode): string | null {
  if (
    node &&
    typeof node === "object" &&
    "props" in node &&
    (node as any).props?.className
  ) {
    const match = String((node as any).props.className).match(/language-(\w+)/);
    if (match) return match[1];
  }
  return null;
}

export default function CodeBlock({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const language = extractLanguage(children);
  const text = extractText(children).replace(/\n$/, "");

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <pre {...props} className={`${props.className ?? ""} code-block-wrapper`}>
      {language && <span className="code-block-lang">{language}</span>}
      <button
        type="button"
        onClick={handleCopy}
        className="code-block-copy"
        aria-label="Copy code"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      {children}
    </pre>
  );
}
