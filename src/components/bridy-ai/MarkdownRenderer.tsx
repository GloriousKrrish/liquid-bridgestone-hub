import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Premium Light-Mode Markdown renderer for Bridy AI concierge responses.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  const elements = parseMarkdown(content);

  return (
    <div className={`bridy-markdown space-y-3 text-[#2D2D2D] ${className}`}>
      {elements}
    </div>
  );
};

function parseMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={key++} className="relative group my-3">
          {lang && (
            <div className="absolute top-0 right-0 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#707070] bg-[#FAF5F6] rounded-bl-lg font-mono border-b border-l border-[#EFE6E8]">
              {lang}
            </div>
          )}
          <pre className="bg-[#FAF5F6] border border-[#EFE6E8] rounded-xl p-4 overflow-x-auto text-xs leading-relaxed">
            <code className="text-[#2D2D2D] font-mono">{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Tables
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1]?.match(/^\s*\|?[\s\-:|]+\|/)) {
      const tableRows: string[][] = [];
      let headers: string[] = [];
      
      headers = line
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      i++; // skip separator
      i++;
      
      while (i < lines.length && lines[i].includes("|")) {
        const cells = lines[i]
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        if (cells.length > 0) tableRows.push(cells);
        i++;
      }

      elements.push(
        <div key={key++} className="my-4 overflow-x-auto rounded-[16px] border border-[#EFE6E8] bg-[#FFFFFF] shadow-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF5F6] border-b border-[#EFE6E8]">
                {headers.map((h, hi) => (
                  <th
                    key={hi}
                    className="px-4 py-3 text-left font-semibold text-[#2D2D2D] uppercase tracking-wider text-[10px]"
                  >
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr
                  key={ri}
                  className="border-b border-[#EFE6E8] hover:bg-[#FAF5F6]/50 transition-colors"
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4.5 py-3 text-[#2D2D2D] leading-relaxed">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h4 key={key++} className="text-sm font-semibold text-[#2D2D2D] mt-4 mb-1.5 tracking-tight">
          {renderInline(line.slice(4))}
        </h4>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="text-base font-semibold text-[#2D2D2D] mt-4 mb-2 tracking-tight">
          {renderInline(line.slice(3))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h2 key={key++} className="text-lg font-semibold text-[#2D2D2D] mt-4 mb-2 tracking-tight">
          {renderInline(line.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    // Unordered list items
    if (line.match(/^\s*[-*]\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s/)) {
        listItems.push(lines[i].replace(/^\s*[-*]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="space-y-1.5 my-2">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2.5 text-[#2D2D2D] text-xs sm:text-sm leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D71920] mt-2 shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list items
    if (line.match(/^\s*\d+\.\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*\d+\.\s/)) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="space-y-1.5 my-2">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2.5 text-[#2D2D2D] text-xs sm:text-sm leading-relaxed">
              <span className="text-[#D71920] font-semibold text-xs mt-0.5 shrink-0 w-4 text-right">
                {li + 1}.
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      elements.push(
        <hr key={key++} className="border-[#EFE6E8] my-4" />
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={key++} className="text-[#2D2D2D] text-xs sm:text-sm leading-relaxed font-normal">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*)|(\*.*?\*)|(`[^`]+`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;
  let partKey = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      parts.push(
        <strong key={partKey++} className="text-[#2D2D2D] font-semibold">
          {match[1].slice(2, -2)}
        </strong>
      );
    } else if (match[2]) {
      parts.push(
        <em key={partKey++} className="italic text-[#707070]">
          {match[2].slice(1, -1)}
        </em>
      );
    } else if (match[3]) {
      parts.push(
        <code
          key={partKey++}
          className="bg-[#F8EDEE] text-[#D71920] px-1.5 py-0.5 rounded text-xs font-mono border border-[#EFE6E8]"
        >
          {match[3].slice(1, -1)}
        </code>
      );
    } else if (match[4]) {
      parts.push(
        <a
          key={partKey++}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#D71920] hover:underline underline-offset-2 font-medium transition-colors"
        >
          {match[5]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 0 ? text : <>{parts}</>;
}
