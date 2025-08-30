import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import ActivityCrud from '../../feature/ActivityCrud';
import { ToastProvider } from '../../../contexts/ToastContext';

// Reuse existing mocks from ActivityCrud.importPreview.test.tsx
jest.mock('@/utils/activity-storage', () => ({
  getActivities: jest.fn(() => [ { id: 'existing-1', name: 'Existing', isActive: true, colorIndex: 0 } ]),
  saveActivities: jest.fn(),
}));
jest.mock('@/utils/activity-import-export', () => ({
  importActivities: jest.fn((arr: unknown[]) => arr.map((a: unknown, i: number) => {
    const ai = a as Record<string, unknown>;
    const name = typeof ai.name === 'string' ? ai.name : `Imported ${i}`;
    const description = typeof ai.description === 'string' ? ai.description : '';
    const colorIndex = typeof ai.colorIndex === 'number' ? ai.colorIndex : i;
    return { id: `imp-${i}`, name, description, colorIndex };
  })) ,
}));

test('ActivityCrud import preview modal should have no basic accessibility violations', async () => {
  render(
    <ToastProvider>
      <ActivityCrud />
    </ToastProvider>
  );

  // Open import dialog
  const importBtn = screen.getByRole('button', { name: /Import/i });
  fireEvent.click(importBtn);

  // Find file input and set file
  const input = screen.getByLabelText(/Import JSON File/i) as HTMLInputElement;
  const fakeFile = ({
    name: 'import.json',
    type: 'application/json',
    text: async () => JSON.stringify({ sessionData: { activities: [{ name: 'Imported Name', description: 'D', colorIndex: 2 }] } })
  } as unknown) as File;
  fireEvent.change(input, { target: { files: [fakeFile] } });

  // Click Import Activities in modal footer
  const importSubmit = await screen.findByRole('button', { name: /Import Activities/i });
  fireEvent.click(importSubmit);

  // Wait for confirmation modal to show processed preview
  await waitFor(() => expect(screen.getByText('Preview of imported activities')).toBeInTheDocument());

  // Run axe on the modal container (use role="dialog" to limit scope to modal)
  const modal = document.querySelector('[role="dialog"]') || document.body;
  const results = await axe(modal as Element);
  expect(results).toHaveNoViolations();
});
