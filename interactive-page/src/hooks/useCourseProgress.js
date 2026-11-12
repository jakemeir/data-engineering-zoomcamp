import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { COURSE_SECTIONS, FLAT_COURSE_ITEMS } from '../data/courseTree';

const INITIAL_PROGRESS_STATE = {
  completedUnits: {},
  completedHomeworks: {},
};

export const useCourseProgress = () => {
  const [progressState, setProgressState] = useLocalStorage(
    'de-zoomcamp-progress-v2',
    INITIAL_PROGRESS_STATE
  );

  const { completedUnits = {}, completedHomeworks = {} } = progressState;

  const toggleUnitCompletion = useCallback(
    (unitPath) => {
      setProgressState((prev) => {
        const { completedUnits: prevUnits = {} } = prev;
        return {
          ...prev,
          completedUnits: {
            ...prevUnits,
            [unitPath]: !prevUnits[unitPath],
          },
        };
      });
    },
    [setProgressState]
  );

  const setMultipleUnitsCompleted = useCallback(
    (unitPaths = [], completed = true) => {
      const updates = unitPaths.reduce(
        (acc, path) => ({
          ...acc,
          [path]: completed,
        }),
        {}
      );
      setProgressState((prev) => ({
        ...prev,
        completedUnits: {
          ...prev.completedUnits,
          ...updates,
        },
      }));
    },
    [setProgressState]
  );

  const markHomeworkCompleted = useCallback(
    (moduleId, scoreDetails) => {
      setProgressState((prev) => ({
        ...prev,
        completedHomeworks: {
          ...prev.completedHomeworks,
          [moduleId]: {
            completed: true,
            updatedAt: new Date().toISOString(),
            ...scoreDetails,
          },
        },
      }));
    },
    [setProgressState]
  );

  const resetAllProgress = useCallback(() => {
    setProgressState(INITIAL_PROGRESS_STATE);
  }, [setProgressState]);

  const stats = useMemo(() => {
    const totalUnitsCount = FLAT_COURSE_ITEMS.length;
    const completedUnitsCount = FLAT_COURSE_ITEMS.filter(({ path }) =>
      Boolean(completedUnits[path])
    ).length;

    const overallPercent =
      totalUnitsCount > 0 ? Math.round((completedUnitsCount / totalUnitsCount) * 100) : 0;

    const sectionProgress = COURSE_SECTIONS.reduce((acc, { id, items }) => {
      const done = items.filter(({ path }) => Boolean(completedUnits[path])).length;
      const total = items.length;
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;
      return {
        ...acc,
        [id]: {
          done,
          total,
          percent,
          isComplete: done === total && total > 0,
        },
      };
    }, {});

    return {
      totalUnitsCount,
      completedUnitsCount,
      overallPercent,
      sectionProgress,
    };
  }, [completedUnits]);

  return {
    completedUnits,
    completedHomeworks,
    stats,
    toggleUnitCompletion,
    setMultipleUnitsCompleted,
    markHomeworkCompleted,
    resetAllProgress,
  };
};
