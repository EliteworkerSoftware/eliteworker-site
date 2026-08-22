import type { ReactNode } from "react";

export function highlightWord(text: string, word: string): ReactNode {
  const index = text.indexOf(word);
  if (index === -1) return text;
  return (
    <>
      {text.slice(0, index)}
      <span className="text-gradient">{word}</span>
      {text.slice(index + word.length)}
    </>
  );
}
