import React, { useRef, useEffect } from 'react';
import {
  Database,
  Play,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Video,
  Search,
  ExternalLink,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { extractYouTubeEmbedUrl, scrollPageToTop } from '../hooks/useLessonReader';
import { MarkdownViewer } from './MarkdownViewer';
import { HOMEWORK_QUIZZES } from '../data/courseData';

export const CourseWorkspace = () => {
  const {
    reader,
    completedUnits,
    toggleUnitCompletion,
    markSectionCompleted,
    resetAllProgress,
    stats,
    quiz,
  } = useCourse();

  const topAnchorRef = useRef(null);

  const {
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
  } = reader;

  const {
    totalUnitsCount,
    completedUnitsCount,
    overallPercent,
    sectionProgress = {},
  } = stats;

  const { selectedAnswers, revealedQuestions, selectOption } = quiz;

  const isModuleAllMode = readMode === 'module-all';
  const embedVideoUrl = extractYouTubeEmbedUrl(currentDoc?.videoUrl);
  const isCurrentDone = Boolean(completedUnits[currentDoc?.path]);

  // Whenever the lesson or module changes, ensure the main view scrolls to the top anchor
  useEffect(() => {
    scrollPageToTop();
    topAnchorRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [currentDoc?.path, readMode]);

  // Only show the interactive quiz on the Homework page itself (or at the bottom of One-Page Module Mode)
  const showInlineQuiz = isModuleAllMode || currentDoc?.kind === 'homework';
  const inlineQuiz =
    showInlineQuiz && currentSection?.quizKey
      ? HOMEWORK_QUIZZES[currentSection.quizKey]
      : null;

  const quizStats = inlineQuiz
    ? (() => {
        const total = inlineQuiz.questions.length;
        const answered = inlineQuiz.questions.filter(
          ({ id }) => selectedAnswers[id] !== undefined
        ).length;
        const correct = inlineQuiz.questions.filter(
          ({ id, correctIndex }) => selectedAnswers[id] === correctIndex
        ).length;
        const percent = total > 0 ? Math.round((correct / total) * 100) : 0;
        return { total, answered, correct, percent };
      })()
    : null;

  const handlePreviousAction = () => {
    if (isModuleAllMode) {
      if (prevSection) {
        selectSection(prevSection.id, true);
      }
    } else if (prevDoc) {
      selectLesson(prevDoc.path);
    }
    scrollPageToTop();
  };

  const handleNextAction = () => {
    if (isModuleAllMode) {
      if (currentSection?.items?.length) {
        markSectionCompleted(currentSection.items.map(({ path }) => path));
      }
      if (nextSection) {
        selectSection(nextSection.id, true);
      }
    } else {
      if (currentDoc?.path && !completedUnits[currentDoc.path]) {
        toggleUnitCompletion(currentDoc.path);
      }
      if (nextDoc) {
        selectLesson(nextDoc.path);
      }
    }
    scrollPageToTop();
  };

  const canGoPrev = isModuleAllMode ? Boolean(prevSection) : Boolean(prevDoc);
  const canGoNext = isModuleAllMode ? Boolean(nextSection) : Boolean(nextDoc);

  const prevButtonLabel = isModuleAllMode
    ? prevSection
      ? `${prevSection.code}: ${prevSection.title}`
      : ''
    : prevDoc?.label || '';

  const nextButtonLabel = isModuleAllMode
    ? nextSection
      ? `${nextSection.code}: ${nextSection.title}`
      : ''
    : nextDoc?.label || '';

  return (
    <div ref={topAnchorRef} className="min-h-screen bg-slate-950 text-slate-100">
      {/* Sticky Top Bar: Course Title + Progress Bar + One-Click Module Strip */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3">
          {/* Left: Brand + Course Progress Bar */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow">
                <Database className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white">Data Engineering Zoomcamp</span>
                <p className="text-[11px] text-slate-400">
                  Interactive Course Reader
                </p>
              </div>
            </div>

            {/* Course Progress Bar */}
            <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2">
              <div className="w-36 sm:w-48">
                <div className="mb-1 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">Course Progress</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {overallPercent}% ({completedUnitsCount}/{totalUnitsCount})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
              </div>

              {completedUnitsCount > 0 && (
                <button
                  onClick={resetAllProgress}
                  title="Reset course progress"
                  className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-800 hover:text-rose-300"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right: 1-Click Module Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {filteredSections.map(({ id, code, title }) => {
              const isCurrentSection = currentSection?.id === id;
              const secProg = sectionProgress[id] || { percent: 0 };
              return (
                <button
                  key={id}
                  onClick={() => selectSection(id, isModuleAllMode)}
                  title={`${title} (${secProg.percent}%)`}
                  className={`relative shrink-0 overflow-hidden rounded-lg px-3 py-1.5 font-mono text-xs font-bold transition ${
                    isCurrentSection
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{code}</span>
                  {!isCurrentSection && secProg.percent > 0 && (
                    <span
                      className="absolute bottom-0 left-0 h-0.5 bg-emerald-400 transition-all"
                      style={{ width: `${secProg.percent}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Split Layout: Always-Visible Full Course Outline (Left) + Instant Reader (Right) */}
      <div className="mx-auto grid max-w-[1600px] lg:grid-cols-12">
        {/* Left Sidebar: Complete Course Tree (All Modules & Lessons Ready to Click) */}
        <aside className="border-b border-slate-800 bg-slate-950/90 lg:sticky lg:top-[65px] lg:col-span-4 lg:h-[calc(100vh-65px)] lg:overflow-y-auto lg:border-r lg:border-b-0 xl:col-span-3">
          <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 p-3 backdrop-blur">
            <div className="relative">
              <Search className="pointer-events-none absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={sidebarFilter}
                onChange={(e) => setSidebarFilter(e.target.value)}
                placeholder="Quick filter lessons (e.g. Docker, Spark, dbt)..."
                className="w-full rounded-lg border border-slate-800 bg-slate-900 py-1.5 pr-3 pl-8 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="divide-y divide-slate-800/70 p-2">
            {filteredSections.map((section) => {
              const { id, code, title, subtitle, items } = section;
              const isSelectedSection = currentSection?.id === id;
              const secStats = sectionProgress[id] || {
                done: 0,
                total: items.length,
                percent: 0,
              };

              return (
                <div key={id} className="py-3">
                  <div className="mb-2 px-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                          {code} · {secStats.done}/{secStats.total} ({secStats.percent}%)
                        </span>
                        <h3 className="text-xs font-extrabold text-white sm:text-sm">
                          {title}
                        </h3>
                        <p className="text-[11px] text-slate-400">{subtitle}</p>
                      </div>
                      <button
                        onClick={() => selectSection(id, true)}
                        title="Show all lessons in this module on one scrollable page"
                        className={`shrink-0 rounded-md border px-2 py-1 font-mono text-[10px] font-semibold transition ${
                          isSelectedSection && isModuleAllMode
                            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200'
                            : 'border-slate-800 bg-slate-900 text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-800'
                        }`}
                      >
                        Read All
                      </button>
                    </div>

                    {/* Per-Module Progress Bar */}
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${secStats.percent}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    {items.map((item) => {
                      const { path, label, kind, videoUrl } = item;
                      const isActive =
                        isModuleAllMode
                          ? isSelectedSection
                          : currentDoc?.path === path;
                      const isDone = Boolean(completedUnits[path]);

                      return (
                        <div
                          key={path}
                          onClick={() => selectLesson(path, true)}
                          className={`group flex cursor-pointer items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs transition ${
                            currentDoc?.path === path && !isModuleAllMode
                              ? 'bg-cyan-500/20 font-semibold text-white ring-1 ring-cyan-500/50'
                              : isActive && isModuleAllMode
                              ? 'bg-cyan-500/10 text-cyan-100'
                              : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleUnitCompletion(path);
                              }}
                              title="Toggle completed"
                              className="shrink-0 text-slate-500 hover:text-emerald-400"
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </button>
                            <span className="truncate">{label}</span>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            {videoUrl && (
                              <span
                                title="Includes Embedded Video Lecture"
                                className="flex items-center gap-0.5 rounded bg-rose-500/15 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-300"
                              >
                                <Play className="h-2.5 w-2.5 fill-current" />
                                Video
                              </span>
                            )}
                            {kind === 'homework' && (
                              <span className="rounded bg-purple-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-purple-300">
                                HW
                              </span>
                            )}
                            {kind === 'solution' && (
                              <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                                Key
                              </span>
                            )}
                            {kind === 'setup' && (
                              <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-300">
                                Setup
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Main Content Pane */}
        <main className="p-4 sm:p-8 lg:col-span-8 xl:col-span-9">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Top Lesson Bar: Breadcrumb + Mode Toggle + Prev/Next */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                  <span>{currentSection?.code}</span>
                  <span>•</span>
                  <span>{currentSection?.title}</span>
                  {!isModuleAllMode && (
                    <>
                      <span>•</span>
                      <code className="rounded bg-slate-950 px-1.5 py-0.5 text-[11px] text-slate-300">
                        {currentDoc?.path}
                      </code>
                    </>
                  )}
                </div>
                <h1 className="mt-1 text-xl font-extrabold text-white sm:text-2xl">
                  {isModuleAllMode
                    ? `${currentSection?.code}: ${currentSection?.title} (Full Module)`
                    : currentDoc?.label}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Toggle Single Lesson vs Entire Module Stacked on One Page */}
                <button
                  onClick={() =>
                    setReadMode(isModuleAllMode ? 'single' : 'module-all')
                  }
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                    isModuleAllMode
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200'
                      : 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                  <span>
                    {isModuleAllMode
                      ? 'One-Page Mode Active (Switch to Single Unit)'
                      : 'Show Entire Module on 1 Page'}
                  </span>
                </button>

                {canGoPrev && (
                  <button
                    onClick={handlePreviousAction}
                    className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>{isModuleAllMode ? `Prev: ${prevSection.code}` : 'Prev'}</span>
                  </button>
                )}

                {canGoNext && (
                  <button
                    onClick={handleNextAction}
                    className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow hover:from-cyan-400 hover:to-blue-500"
                  >
                    <span>
                      {isModuleAllMode ? `Next: ${nextSection.code}` : 'Next Lesson'}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Mode 1: Single Lesson Reader */}
            {!isModuleAllMode ? (
              <div className="space-y-6">
                {/* Embedded YouTube Lecture Player if lesson has a video */}
                {embedVideoUrl && (
                  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 text-xs">
                      <span className="flex items-center gap-2 font-semibold text-white">
                        <Video className="h-4 w-4 text-rose-400" />
                        Video Lecture — {currentDoc.label}
                      </span>
                      <a
                        href={currentDoc.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-cyan-400 hover:underline"
                      >
                        <span>Watch on YouTube</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="aspect-video w-full bg-black">
                      <iframe
                        src={embedVideoUrl}
                        title={currentDoc.label}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Full Markdown Content from Cloned Repo */}
                <article className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl sm:p-8">
                  <MarkdownViewer
                    doc={currentDoc}
                    onNavigateDoc={(targetPath) => selectLesson(targetPath)}
                  />
                </article>
              </div>
            ) : (
              /* Mode 2: One-Page Mode — Entire Module Rendered on One Page */
              <div className="space-y-8">
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-xs text-cyan-200">
                  <strong>One-Page Module Mode:</strong> All {currentSection.items.length} lessons in{' '}
                  <strong>{currentSection.title}</strong> are stacked below. At the bottom, click{' '}
                  <strong>Next Course Module</strong> to jump straight to{' '}
                  <strong>{nextSection ? `${nextSection.code}: ${nextSection.title}` : 'the end of the course'}</strong>!
                </div>

                {currentSection.items.map((unitDoc) => {
                  const unitVideo = extractYouTubeEmbedUrl(unitDoc.videoUrl);
                  return (
                    <section
                      key={unitDoc.path}
                      className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl sm:p-8"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <span className="font-mono text-xs text-cyan-400">
                            {unitDoc.path}
                          </span>
                          <h2 className="text-xl font-extrabold text-white">
                            {unitDoc.label}
                          </h2>
                        </div>
                        <button
                          onClick={() => toggleUnitCompletion(unitDoc.path)}
                          className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                            completedUnits[unitDoc.path]
                              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                              : 'border-slate-700 bg-slate-800 text-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>
                            {completedUnits[unitDoc.path] ? 'Completed' : 'Mark Done'}
                          </span>
                        </button>
                      </div>

                      {unitVideo && (
                        <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black">
                          <iframe
                            src={unitVideo}
                            title={unitDoc.label}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}

                      <MarkdownViewer
                        doc={unitDoc}
                        onNavigateDoc={(targetPath) => selectLesson(targetPath, true)}
                      />
                    </section>
                  );
                })}
              </div>
            )}

            {/* Inline Interactive Quiz whenever viewing a Homework or Module */}
            {inlineQuiz && quizStats && (
              <section className="space-y-4 rounded-3xl border border-purple-500/30 bg-slate-900/80 p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold uppercase text-purple-400">
                      Interactive Self-Check Quiz
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {inlineQuiz.title}
                    </h3>
                  </div>

                  {/* Quiz Progress Bar */}
                  <div className="w-48">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Quiz Progress</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {quizStats.correct}/{quizStats.total} ({quizStats.percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${quizStats.percent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {inlineQuiz.questions.map(
                    ({ id, question, options, correctIndex, explanation }, qIdx) => {
                      const chosenIdx = selectedAnswers[id];
                      const isRevealed = Boolean(revealedQuestions[id]);
                      const isCorrect = chosenIdx === correctIndex;

                      return (
                        <div
                          key={id}
                          className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                        >
                          <div className="text-sm font-semibold text-white">
                            Q{qIdx + 1}. {question}
                          </div>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {options.map((opt, optIdx) => {
                              const isRight = optIdx === correctIndex;
                              const isSelected = chosenIdx === optIdx;
                              let style =
                                'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700';
                              if (isRevealed) {
                                if (isRight) {
                                  style =
                                    'border-emerald-500/60 bg-emerald-500/15 text-emerald-100 font-semibold';
                                } else if (isSelected) {
                                  style =
                                    'border-rose-500/60 bg-rose-500/15 text-rose-200';
                                }
                              }
                              return (
                                <button
                                  key={opt}
                                  onClick={() => selectOption(id, optIdx)}
                                  className={`rounded-xl border p-3 text-left font-mono text-xs transition ${style}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {isRevealed && (
                            <div
                              className={`rounded-xl border p-3 text-xs ${
                                isCorrect
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                                  : 'border-amber-500/30 bg-amber-500/10 text-amber-200'
                              }`}
                            >
                              <strong>{isCorrect ? '✓ Correct: ' : 'Solution: '}</strong>
                              {explanation}
                            </div>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </section>
            )}

            {/* Bottom Navigation Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
              {canGoPrev ? (
                <button
                  onClick={handlePreviousAction}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 sm:text-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>
                    {isModuleAllMode
                      ? `Previous Module — ${prevButtonLabel}`
                      : `Previous: ${prevButtonLabel}`}
                  </span>
                </button>
              ) : (
                <div />
              )}

              {canGoNext && (
                <button
                  onClick={handleNextAction}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-emerald-400 hover:to-cyan-500 sm:text-sm"
                >
                  <span>
                    {isModuleAllMode
                      ? `Complete & Next Module — ${nextButtonLabel}`
                      : `${isCurrentDone ? 'Next' : 'Complete & Continue'}: ${nextButtonLabel}`}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
