import { useState, useEffect, useMemo, useCallback } from 'react';
import { COURSE_SECTIONS, FLAT_COURSE_ITEMS } from '../data/courseTree';

export const useCommandPalette = ({ onSelectLesson, onSelectSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key, metaKey, ctrlKey } = event;
      if ((metaKey || ctrlKey) && key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allSearchItems = useMemo(() => {
    const sectionItems = COURSE_SECTIONS.map(({ id, code, title, subtitle }) => ({
      id: `sec-${id}`,
      type: 'Module',
      title: `${code}: ${title}`,
      subtitle,
      action: () => onSelectSection(id, false),
    }));

    const lessonItems = FLAT_COURSE_ITEMS.map(({ path, label, sectionCode, videoUrl }) => ({
      id: `lesson-${path}`,
      type: videoUrl ? 'Video Lesson' : 'Lesson',
      title: label,
      subtitle: `${sectionCode} · ${path}`,
      action: () => onSelectLesson(path, true),
    }));

    return [...sectionItems, ...lessonItems];
  }, [onSelectLesson, onSelectSection]);

  const filteredItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return allSearchItems.slice(0, 16);
    return allSearchItems
      .filter(
        ({ title, subtitle, type }) =>
          title.toLowerCase().includes(trimmed) ||
          subtitle.toLowerCase().includes(trimmed) ||
          type.toLowerCase().includes(trimmed)
      )
      .slice(0, 24);
  }, [allSearchItems, query]);

  const openPalette = useCallback(() => setIsOpen(true), []);
  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  return {
    isOpen,
    query,
    setQuery,
    filteredItems,
    openPalette,
    closePalette,
  };
};
