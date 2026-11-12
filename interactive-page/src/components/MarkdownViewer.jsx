import React, { useState } from 'react';
import { Copy, Check, ExternalLink, FileText, Play } from 'lucide-react';
import { resolveRelativeRepoPath, extractYouTubeEmbedUrl } from '../hooks/useLessonReader';
import { getDocByPath } from '../data/courseTree';

const CodeBlock = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800/90 bg-slate-900/90 px-3.5 py-2 text-xs">
        <span className="font-mono font-semibold uppercase tracking-wider text-cyan-400">
          {language || 'shell / code'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-200 transition hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-300">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-200 sm:text-[13px]">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export const MarkdownViewer = ({ doc, onNavigateDoc }) => {
  const { body = '', dir = '' } = doc || {};

  // Clean HTML tags that wrap images in main README while preserving content
  const cleanedBody = body
    .replace(/<details>\s*<summary>(.*?)<\/summary>/gi, '\n### $1\n')
    .replace(/<\/details>/gi, '\n');

  // Split by fenced code blocks first
  const segments = [];
  const fenceRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = fenceRegex.exec(cleanedBody)) !== null) {
    if (match.index > lastIndex) {
      segments.push({
        type: 'prose',
        content: cleanedBody.slice(lastIndex, match.index),
      });
    }
    segments.push({
      type: 'code',
      language: match[1].trim(),
      code: match[2].replace(/\n$/, ''),
    });
    lastIndex = fenceRegex.lastIndex;
  }

  if (lastIndex < cleanedBody.length) {
    segments.push({
      type: 'prose',
      content: cleanedBody.slice(lastIndex),
    });
  }

  const renderInline = (text, keyPrefix) => {
    if (!text) return null;

    // Handle inline markdown images: ![alt](src)
    const tokenRegex =
      /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
    const parts = [];
    let cursor = 0;
    let tok;
    let idx = 0;

    while ((tok = tokenRegex.exec(text)) !== null) {
      if (tok.index > cursor) {
        parts.push(text.slice(cursor, tok.index));
      }

      const [
        ,
        imgAlt,
        imgSrc,
        linkLabel,
        linkHref,
        inlineCode,
        boldText,
      ] = tok;

      if (imgSrc !== undefined) {
        const cleanSrc = imgSrc.split(' ')[0].replace(/^["']|["']$/g, '');
        const resolvedImg =
          cleanSrc.startsWith('http://') || cleanSrc.startsWith('https://')
            ? cleanSrc
            : `/repo-raw/${resolveRelativeRepoPath(dir, cleanSrc)}`;
        parts.push(
          <span key={`${keyPrefix}-img-${idx}`} className="my-4 block">
            <img
              src={resolvedImg}
              alt={imgAlt || 'Course diagram'}
              className="max-h-[480px] w-auto rounded-xl border border-slate-800 bg-white/95 p-2 shadow-md"
              loading="lazy"
            />
            {imgAlt && (
              <span className="mt-1.5 block text-xs italic text-slate-400">
                {imgAlt}
              </span>
            )}
          </span>
        );
      } else if (linkHref !== undefined) {
        const resolvedTarget = resolveRelativeRepoPath(dir, linkHref);
        const targetDoc =
          !linkHref.startsWith('http://') &&
          !linkHref.startsWith('https://') &&
          getDocByPath(resolvedTarget);

        const ytEmbed = extractYouTubeEmbedUrl(linkHref);

        if (targetDoc) {
          parts.push(
            <button
              key={`${keyPrefix}-link-${idx}`}
              onClick={() => onNavigateDoc(targetDoc.path)}
              className="inline-flex items-center gap-1 rounded bg-cyan-500/15 px-1.5 py-0.5 font-medium text-cyan-300 underline decoration-cyan-500/40 transition hover:bg-cyan-500/25"
            >
              <FileText className="h-3 w-3" />
              <span>{linkLabel}</span>
            </button>
          );
        } else {
          parts.push(
            <a
              key={`${keyPrefix}-ext-${idx}`}
              href={
                linkHref.startsWith('http')
                  ? linkHref
                  : `/repo-raw/${resolvedTarget}`
              }
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-cyan-400 underline decoration-cyan-500/40 hover:text-cyan-300"
            >
              {ytEmbed && <Play className="h-3 w-3 text-rose-400 fill-current" />}
              <span>{linkLabel}</span>
              <ExternalLink className="h-3 w-3 opacity-75" />
            </a>
          );
        }
      } else if (inlineCode !== undefined) {
        parts.push(
          <code
            key={`${keyPrefix}-code-${idx}`}
            className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 font-mono text-[12px] text-cyan-200"
          >
            {inlineCode}
          </code>
        );
      } else if (boldText !== undefined) {
        parts.push(
          <strong key={`${keyPrefix}-bold-${idx}`} className="font-semibold text-white">
            {boldText}
          </strong>
        );
      }

      cursor = tokenRegex.lastIndex;
      idx += 1;
    }

    if (cursor < text.length) {
      parts.push(text.slice(cursor));
    }

    return parts;
  };

  const renderProseBlock = (proseText, segIdx) => {
    const lines = proseText.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        i += 1;
        continue;
      }

      // Skip raw HTML wrappers or extract img src from HTML <img>
      if (trimmed.startsWith('<')) {
        const htmlImgMatch = trimmed.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
        if (htmlImgMatch) {
          const rawSrc = htmlImgMatch[1];
          const resolvedSrc = rawSrc.startsWith('http')
            ? rawSrc
            : `/repo-raw/${resolveRelativeRepoPath(dir, rawSrc)}`;
          elements.push(
            <div key={`html-img-${segIdx}-${i}`} className="my-4">
              <img
                src={resolvedSrc}
                alt="Diagram"
                className="max-h-96 w-auto rounded-xl border border-slate-800 bg-white/95 p-2"
              />
            </div>
          );
        }
        i += 1;
        continue;
      }

      // Horizontal rule
      if (/^---+$/.test(trimmed)) {
        elements.push(
          <hr key={`hr-${segIdx}-${i}`} className="my-6 border-slate-800" />
        );
        i += 1;
        continue;
      }

      // Headings
      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2];
        const styles = {
          1: 'mt-6 mb-4 text-2xl font-extrabold text-white sm:text-3xl border-b border-slate-800 pb-3',
          2: 'mt-7 mb-3 text-xl font-bold text-white border-b border-slate-800/70 pb-2',
          3: 'mt-5 mb-2 text-base font-bold text-cyan-200',
          4: 'mt-4 mb-1.5 text-sm font-semibold text-slate-200',
        };
        elements.push(
          <div key={`h-${segIdx}-${i}`} className={styles[level]}>
            {renderInline(text, `h-${segIdx}-${i}`)}
          </div>
        );
        i += 1;
        continue;
      }

      // Markdown Table
      if (trimmed.startsWith('|') && i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) {
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|')) {
          tableLines.push(lines[i].trim());
          i += 1;
        }
        const rows = tableLines
          .filter((rowLine) => !/^\|[\s:-]+\|$/.test(rowLine.replace(/\|/g, '|')))
          .filter((rowLine) => !rowLine.match(/^\|\s*[-:]+\s*(\|\s*[-:]+\s*)+\|?$/))
          .map((rowLine) =>
            rowLine
              .replace(/^\|/, '')
              .replace(/\|$/, '')
              .split('|')
              .map((cell) => cell.trim())
          );

        if (rows.length > 0) {
          const [headerRow, ...bodyRows] = rows;
          elements.push(
            <div
              key={`tbl-${segIdx}-${i}`}
              className="my-4 overflow-x-auto rounded-xl border border-slate-800"
            >
              <table className="w-full border-collapse text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 text-slate-200">
                  <tr>
                    {headerRow.map((cell, cIdx) => (
                      <th
                        key={cIdx}
                        className="border-b border-slate-800 px-3.5 py-2.5 font-semibold"
                      >
                        {renderInline(cell, `th-${segIdx}-${i}-${cIdx}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70 bg-slate-950/60">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900/40">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3.5 py-2.5 text-slate-300">
                          {renderInline(cell, `td-${segIdx}-${i}-${rIdx}-${cIdx}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        continue;
      }

      // Blockquote
      if (trimmed.startsWith('>')) {
        const quoteLines = [];
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
          i += 1;
        }
        const quoteText = quoteLines.join(' ').replace(/\[!(IMPORTANT|NOTE|TIP|WARNING)\]/gi, '');
        elements.push(
          <blockquote
            key={`q-${segIdx}-${i}`}
            className="my-4 rounded-r-xl border-l-4 border-cyan-500 bg-cyan-500/10 px-4 py-3 text-xs leading-relaxed text-cyan-100 sm:text-sm"
          >
            {renderInline(quoteText, `q-${segIdx}-${i}`)}
          </blockquote>
        );
        continue;
      }

      // Bullet or Numbered List
      if (/^([-*]|\d+\.)\s+/.test(trimmed)) {
        const listItems = [];
        while (i < lines.length && /^(\s*[-*]|\s*\d+\.)\s+/.test(lines[i])) {
          listItems.push(lines[i].replace(/^(\s*[-*]|\s*\d+\.)\s+/, '').trim());
          i += 1;
        }
        elements.push(
          <ul
            key={`ul-${segIdx}-${i}`}
            className="my-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-300"
          >
            {listItems.map((itemText, idx) => (
              <li key={idx}>{renderInline(itemText, `li-${segIdx}-${i}-${idx}`)}</li>
            ))}
          </ul>
        );
        continue;
      }

      // Paragraph
      const paraLines = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].trim().startsWith('#') &&
        !lines[i].trim().startsWith('>') &&
        !lines[i].trim().startsWith('|') &&
        !lines[i].trim().startsWith('<') &&
        !/^---+$/.test(lines[i].trim()) &&
        !/^([-*]|\d+\.)\s+/.test(lines[i].trim())
      ) {
        paraLines.push(lines[i].trim());
        i += 1;
      }

      if (paraLines.length > 0) {
        elements.push(
          <p
            key={`p-${segIdx}-${i}`}
            className="my-3 text-sm leading-7 text-slate-300 sm:text-[15px]"
          >
            {renderInline(paraLines.join(' '), `p-${segIdx}-${i}`)}
          </p>
        );
      } else {
        i += 1;
      }
    }

    return elements;
  };

  return (
    <div className="prose-invert max-w-none">
      {segments.map((segment, idx) =>
        segment.type === 'code' ? (
          <CodeBlock
            key={`code-${idx}`}
            language={segment.language}
            code={segment.code}
          />
        ) : (
          <div key={`prose-${idx}`}>{renderProseBlock(segment.content, idx)}</div>
        )
      )}
    </div>
  );
};
