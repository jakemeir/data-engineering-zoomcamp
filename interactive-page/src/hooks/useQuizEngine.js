import { useState, useMemo, useCallback } from 'react';
import { HOMEWORK_QUIZZES } from '../data/courseData';
import { useLocalStorage } from './useLocalStorage';

export const useQuizEngine = (onModuleComplete) => {
  const [activeQuizModuleId, setActiveQuizModuleId] = useState('m1');
  const [selectedAnswers, setSelectedAnswers] = useLocalStorage('de-zoomcamp-quiz-answers-v1', {});
  const [revealedQuestions, setRevealedQuestions] = useLocalStorage(
    'de-zoomcamp-quiz-revealed-v1',
    {}
  );

  const currentQuiz = useMemo(
    () => HOMEWORK_QUIZZES[activeQuizModuleId] || HOMEWORK_QUIZZES.m1,
    [activeQuizModuleId]
  );

  const selectOption = useCallback(
    (questionId, optionIndex) => {
      setSelectedAnswers((prev) => ({
        ...prev,
        [questionId]: optionIndex,
      }));
      setRevealedQuestions((prev) => ({
        ...prev,
        [questionId]: true,
      }));
    },
    [setSelectedAnswers, setRevealedQuestions]
  );

  const resetModuleQuiz = useCallback(
    (moduleId) => {
      const targetQuiz = HOMEWORK_QUIZZES[moduleId];
      if (!targetQuiz) return;

      const { questions = [] } = targetQuiz;
      const questionIds = questions.map(({ id }) => id);

      setSelectedAnswers((prev) => {
        const next = { ...prev };
        questionIds.forEach((qId) => {
          delete next[qId];
        });
        return next;
      });

      setRevealedQuestions((prev) => {
        const next = { ...prev };
        questionIds.forEach((qId) => {
          delete next[qId];
        });
        return next;
      });
    },
    [setSelectedAnswers, setRevealedQuestions]
  );

  const quizScoreSummary = useMemo(() => {
    const { questions = [], moduleId } = currentQuiz;
    const answeredCount = questions.filter(({ id }) => selectedAnswers[id] !== undefined).length;
    const correctCount = questions.filter(
      ({ id, correctIndex }) => selectedAnswers[id] === correctIndex
    ).length;
    const totalCount = questions.length;
    const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    return {
      moduleId,
      answeredCount,
      correctCount,
      totalCount,
      scorePercent,
      isAllAnswered: answeredCount === totalCount && totalCount > 0,
    };
  }, [currentQuiz, selectedAnswers]);

  const submitQuizToProgress = useCallback(() => {
    const { moduleId, correctCount, totalCount, scorePercent } = quizScoreSummary;
    if (onModuleComplete) {
      onModuleComplete(moduleId, {
        correctCount,
        totalCount,
        scorePercent,
      });
    }
  }, [quizScoreSummary, onModuleComplete]);

  return {
    activeQuizModuleId,
    setActiveQuizModuleId,
    currentQuiz,
    selectedAnswers,
    revealedQuestions,
    selectOption,
    resetModuleQuiz,
    quizScoreSummary,
    submitQuizToProgress,
  };
};
