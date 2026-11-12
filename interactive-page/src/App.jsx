import React from 'react';
import { CourseProvider } from './context/CourseContext';
import { CourseWorkspace } from './components/CourseWorkspace';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  return (
    <CourseProvider>
      <CourseWorkspace />
      <CommandPalette />
    </CourseProvider>
  );
}
