import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ShareControls from '@/components/ShareControls';

// Mock window.alert to avoid noisy test output
beforeAll(() => {
  window.alert = jest.fn();
});

describe('ShareControls', () => {
  it('calls copy and open actions and download', async () => {
    const shareUrl = 'https://example.com/shared/abc-123';

    // mock clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });

    // mock fetch for download
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ sessionData: { foo: 'bar' }, metadata: { id: 'abc-123' } }),
    } as unknown as Response);

    render(<ShareControls shareUrl={shareUrl} />);

  const copyBtn = screen.getByRole('button', { name: /copy share link to clipboard/i });
    fireEvent.click(copyBtn);

    await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(shareUrl));

  const downloadBtn = screen.getByRole('button', { name: /download shared session as json/i });
    fireEvent.click(downloadBtn);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
  });
});
