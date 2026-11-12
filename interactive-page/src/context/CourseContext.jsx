import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useCourseProgress } from '../hooks/useCourseProgress';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { useCommandPalette } from '../hooks/useCommandPalette';
import { useLessonReader } from '../hooks/useLessonReader';

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const progress = useCourseProgress();
  const quiz = useQuizEngine(progress.markHomeworkCompleted);
  const reader = useLessonReader();

  const commandPalette = useCommandPalette({
    onSelectLesson: reader.selectLesson,
    onSelectSection: reader.selectSection,
  });

  const markSectionCompleted = useCallback(
    (paths = []) => {
      progress.setMultipleUnitsCompleted(paths, true);
    },
    [progress]
  );

  const contextValue = useMemo(
    () => ({
      ...progress,
      markSectionCompleted,
      reader: { ...reader },
      quiz: { ...quiz },
      commandPalette: { ...commandPalette },
    }),
    [progress, markSectionCompleted, reader, quiz, commandPalette]
  );

  return <CourseContext.Provider value={contextValue}>{children}</CourseContext.Provider>;
};

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};
