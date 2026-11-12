import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');
const OUTPUT_FILE = path.resolve(import.meta.dirname, '..', 'src', 'data', 'courseContentMap.json');

const IGNORED_DIRS = new Set(['.git', 'interactive-page', '.tmp', 'node_modules']);
const LEGACY_COHORT_PREFIXES = [
  'cohorts/2022',
  'cohorts/2023',
  'cohorts/2024',
  'cohorts/2025',
];

const parseMarkdownFile = (relPath) => {
  const fullPath = path.join(REPO_ROOT, relPath);
  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  let videoUrl = null;
  let prevUrl = null;
  let nextUrl = null;
  let body = raw;

  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n*/);
  if (fmMatch) {
    body = raw.slice(fmMatch[0].length);
    const [, fm] = fmMatch;
    const vMatch = fm.match(/video_url:\s*(.+)/);
    const pMatch = fm.match(/prev_url:\s*(.+)/);
    const nMatch = fm.match(/next_url:\s*(.+)/);
    if (vMatch) videoUrl = vMatch[1].trim();
    if (pMatch) prevUrl = pMatch[1].trim();
    if (nMatch) nextUrl = nMatch[1].trim();
  }

  if (!videoUrl) {
    const ytMatch = body
      .slice(0, 600)
      .match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      videoUrl = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
    }
  }

  const titleMatch = body.match(/^#+\s+(.+)/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(relPath, '.md');

  return {
    path: relPath,
    dir: path.dirname(relPath),
    title,
    videoUrl,
    prevUrl,
    nextUrl,
    body,
  };
};

const contentMap = {};

const walkRepo = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(REPO_ROOT, full).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (LEGACY_COHORT_PREFIXES.some((prefix) => rel.startsWith(prefix))) continue;
      walkRepo(full);
    } else if (entry.name.endsWith('.md')) {
      const parsed = parseMarkdownFile(rel);
      if (parsed) contentMap[rel] = parsed;
    }
  }
};

walkRepo(REPO_ROOT);
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(contentMap, null, 2));
console.log(`Synced ${Object.keys(contentMap).length} course markdown files -> ${OUTPUT_FILE}`);
