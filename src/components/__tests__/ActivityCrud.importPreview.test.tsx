import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActivityCrud from '../feature/ActivityCrud';
import { ToastProvider } from '../../contexts/ToastContext';

// Mock activity-storage utilities
jest.mock('@/utils/activity-storage', () => ({
  getActivities: jest.fn(() => [ { id: 'existing-1', name: 'Existing', isActive: true, colorIndex: 0 } ]),
  saveActivities: jest.fn(),
}));

// Mock importActivities utility to validate processing
jest.mock('@/utils/activity-import-export', () => ({
  importActivities: jest.fn((arr: unknown[]) => arr.map((a: unknown, i: number) => {
    const ai = a as Record<string, unknown>;
    const name = typeof ai.name === 'string' ? ai.name : `Imported ${i}`;
    const description = typeof ai.description === 'string' ? ai.description : '';
    const colorIndex = typeof ai.colorIndex === 'number' ? ai.colorIndex : i;
    return { id: `imp-${i}`, name, description, colorIndex };
  })) ,
}));

describe('ActivityCrud import preview', () => {
  beforeAll(() => {
  // Provide a mock for window.File and File.prototype.text
  // Assign global File for test environment (jsdom may not expose File)
  (globalThis as unknown as { File?: typeof File }).File = File;
    // mock addEventListener etc if needed
  });

  it('shows processed import preview in confirmation modal', async () => {
    render(
      <ToastProvider>
        <ActivityCrud />
      </ToastProvider>
    );

    // Click Import button in ActivityList (find by role and name)
    const importBtn = screen.getByRole('button', { name: /Import/i });
    fireEvent.click(importBtn);

    // Find file input and set file
    const input = screen.getByLabelText(/Import JSON File/i) as HTMLInputElement;
    // Create a fake file object with a text() method (jsdom File.text may not be available)
    const fakeFile = ({
      name: 'import.json',
      type: 'application/json',
      text: async () => JSON.stringify({ sessionData: { activities: [{ name: 'Imported Name', description: 'D', colorIndex: 2 }] } })
    } as unknown) as File;

    // Simulate file selection
    fireEvent.change(input, { target: { files: [fakeFile] } });

    // Click Import Activities in modal footer
    const importSubmit = screen.getByRole('button', { name: /Import Activities/i });
    fireEvent.click(importSubmit);

    // Wait for confirmation modal to show processed preview
    await waitFor(() => expect(screen.getByText('Preview of imported activities')).toBeInTheDocument());

    // Ensure processed preview item is displayed
    expect(screen.getByText('Imported Name')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });
});
