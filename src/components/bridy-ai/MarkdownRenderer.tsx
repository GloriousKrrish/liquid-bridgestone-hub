import React from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Lightweight Markdown renderer for Bridy AI responses.
 * Supports: bold, italic, code, code blocks, headers, lists, tables, links, line breaks.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
}) => {
  const elements = parseMarkdown(content);

  return (
    <div className={`bridy-markdown space-y-2 ${className}`}>
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
            <div className="absolute top-0 right-0 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/40 bg-white/5 rounded-bl-md font-mono">
              {lang}
            </div>
          )}
          <pre className="bg-black/30 border border-white/10 rounded-lg p-3 overflow-x-auto text-[11px] leading-relaxed">
            <code className="text-emerald-300 font-mono">{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Tables
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1]?.match(/^\s*\|?[\s\-:|]+\|/)) {
      const tableRows: string[][] = [];
      let headers: string[] = [];
      
      // Parse header row
      headers = line
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      i++; // skip separator row
      i++;
      
      // Parse body rows
      while (i < lines.length && lines[i].includes("|")) {
        const cells = lines[i]
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean);
        if (cells.length > 0) tableRows.push(cells);
        i++;
      }

      elements.push(
        <div key={key++} className="my-3 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                {headers.map((h, hi) => (
                  <th
                    key={hi}
                    className="px-3 py-2 text-left font-bold text-white/80 uppercase tracking-wider text-[10px]"
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
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-white/70">
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
        <h4 key={key++} className="text-[13px] font-bold text-white mt-3 mb-1">
          {renderInline(line.slice(4))}
        </h4>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="text-sm font-bold text-white mt-3 mb-1">
          {renderInline(line.slice(3))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h2 key={key++} className="text-[15px] font-bold text-white mt-3 mb-1">
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
        <ul key={key++} className="space-y-1 ml-1">
          {listItems.map((item, li) => (
            <li key={li} className="flex gap-2 text-white/80 text-[12px] leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-[#CC0000] mt-[7px] shrink-0" />
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
        <ol key={key++} className="space-y-1 ml-1">
          {listItems.map((item, li) => (
            <li key={li} className="flex gap-2 text-white/80 text-[12px] leading-relaxed">
              <span className="text-[#CC0000] font-bold text-[11px] mt-[1px] shrink-0 w-4 text-right">
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
        <hr key={key++} className="border-white/10 my-3" />
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
      <p key={key++} className="text-white/80 text-[12px] leading-relaxed">
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return elements;
}

/**
 * Render inline markdown: bold, italic, code, links
 */
function renderInline(text: string): React.ReactNode {
  // Process inline elements with regex
  const parts: React.ReactNode[] = [];
  // Pattern: **bold**, *italic*, `code`, [text](url)
  const regex = /(\*\*.*?\*\*)|(\*.*?\*)|(`[^`]+`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match;
  let partKey = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Bold
      parts.push(
        <strong key={partKey++} className="text-white font-semibold">
          {match[1].slice(2, -2)}
        </strong>
      );
    } else if (match[2]) {
      // Italic
      parts.push(
        <em key={partKey++} className="italic text-white/90">
          {match[2].slice(1, -1)}
        </em>
      );
    } else if (match[3]) {
      // Inline code
      parts.push(
        <code
          key={partKey++}
          className="bg-white/10 text-emerald-300 px-1.5 py-0.5 rounded text-[11px] font-mono"
        >
          {match[3].slice(1, -1)}
        </code>
      );
    } else if (match[4]) {
      // Link
      parts.push(
        <a
          key={partKey++}
          href={match[6]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00E5FF] hover:text-[#00E5FF]/80 underline underline-offset-2 transition-colors"
        >
          {match[5]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 0 ? text : <>{parts}</>;
}
