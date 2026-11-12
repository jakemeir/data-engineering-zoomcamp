import { useState, useMemo, useCallback, useEffect } from 'react';
import { COURSE_SECTIONS, FLAT_COURSE_ITEMS, getDocByPath } from '../data/courseTree';

export const extractYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

export const resolveRelativeRepoPath = (baseDir, href) => {
  if (!href) return '';
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return href;
  }
  const cleanHref = href.split('#')[0].split('?')[0];
  if (!cleanHref) return '';

  if (cleanHref.startsWith('/')) {
    return cleanHref.replace(/^\/+/, '');
  }

  const baseParts = baseDir && baseDir !== '.' ? baseDir.split('/').filter(Boolean) : [];
  const relParts = cleanHref.split('/').filter(Boolean);
  const stack = [...baseParts];

  for (const part of relParts) {
    if (part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return stack.join('/');
};

export const scrollPageToTop = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  document.documentElement.scrollTo?.({ top: 0, left: 0, behavior: 'smooth' });
  document.body.scrollTo?.({ top: 0, left: 0, behavior: 'smooth' });
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
};

export const useLessonReader = () => {
  const [currentPath, setCurrentPath] = useState('01-docker-terraform/01-introduction.md');
  const [readMode, setReadMode] = useState('single'); // 'single' | 'module-all'
  const [sidebarFilter, setSidebarFilter] = useState('');

  // Always scroll to top after lesson or mode changes and DOM updates
  useEffect(() => {
    scrollPageToTop();
  }, [currentPath, readMode]);

  const currentDoc = useMemo(
    () => getDocByPath(currentPath) || FLAT_COURSE_ITEMS[0],
    [currentPath]
  );

  const currentIndex = useMemo(
    () => FLAT_COURSE_ITEMS.findIndex(({ path }) => path === currentDoc?.path),
    [currentDoc]
  );

  const prevDoc = useMemo(
    () => (currentIndex > 0 ? FLAT_COURSE_ITEMS[currentIndex - 1] : null),
    [currentIndex]
  );

  const nextDoc = useMemo(
    () =>
      currentIndex >= 0 && currentIndex < FLAT_COURSE_ITEMS.length - 1
        ? FLAT_COURSE_ITEMS[currentIndex + 1]
        : null,
    [currentIndex]
  );

  const currentSectionIndex = useMemo(() => {
    const idx = COURSE_SECTIONS.findIndex(({ id }) => id === currentDoc?.sectionId);
    return idx >= 0 ? idx : 0;
  }, [currentDoc]);

  const currentSection = useMemo(
    () => COURSE_SECTIONS[currentSectionIndex] || COURSE_SECTIONS[0],
    [currentSectionIndex]
  );

  const prevSection = useMemo(
    () => (currentSectionIndex > 0 ? COURSE_SECTIONS[currentSectionIndex - 1] : null),
    [currentSectionIndex]
  );

  const nextSection = useMemo(
    () =>
      currentSectionIndex >= 0 && currentSectionIndex < COURSE_SECTIONS.length - 1
        ? COURSE_SECTIONS[currentSectionIndex + 1]
        : null,
    [currentSectionIndex]
  );

  const filteredSections = useMemo(() => {
    const q = sidebarFilter.trim().toLowerCase();
    if (!q) return COURSE_SECTIONS;

    return COURSE_SECTIONS.map((section) => {
      const matchingItems = section.items.filter(
        ({ label, title, path }) =>
          label.toLowerCase().includes(q) ||
          title.toLowerCase().includes(q) ||
          path.toLowerCase().includes(q)
      );
      const sectionMatches =
        section.title.toLowerCase().includes(q) ||
        section.subtitle.toLowerCase().includes(q);

      return {
        ...section,
        items: sectionMatches ? section.items : matchingItems,
      };
    }).filter(({ items }) => items.length > 0);
  }, [sidebarFilter]);

  const selectLesson = useCallback((path, forceSingleMode = false) => {
    const resolved = getDocByPath(path);
    if (resolved) {
      setCurrentPath(resolved.path);
      if (forceSingleMode) {
        setReadMode('single');
      }
      scrollPageToTop();
    }
  }, []);

  const selectSection = useCallback((sectionId, bingeAll = false) => {
    const section = COURSE_SECTIONS.find(({ id }) => id === sectionId);
    if (!section || section.items.length === 0) return;
    const firstUnit =
      section.items.find(({ kind }) => kind === 'unit') || section.items[0];
    setCurrentPath(firstUnit.path);
    if (bingeAll) {
      setReadMode('module-all');
    }
    scrollPageToTop();
  }, []);

  return {
    currentPath,
    currentDoc,
    currentSection,
    prevDoc,
    nextDoc,
    prevSection,
    nextSection,
    readMode,
    setReadMode,
    sidebarFilter,
    setSidebarFilter,
    filteredSections,
    selectLesson,
    selectSection,
  };
};
