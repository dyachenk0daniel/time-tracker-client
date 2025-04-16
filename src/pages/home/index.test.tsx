import { describe, expect, it, Mock, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useGetTimeEntriesQuery } from '@entities/time-entry/hooks';
import TimeEntryList from '@entities/time-entry/components/time-entry-list';
import StartTaskTimer from '@entities/time-entry/components/start-task-timer'; // Новый импорт
import { Home } from './index';

vi.mock('@entities/time-entry/hooks', () => ({
  useGetTimeEntriesQuery: vi.fn(),
}));

vi.mock('@entities/time-entry/components/time-entry-list', () => ({
  default: vi.fn(),
}));

vi.mock('@entities/time-entry/components/start-task-timer', () => ({
  default: vi.fn(),
}));

describe('Home', () => {
  beforeEach(() => {
    vi.mocked(TimeEntryList).mockReturnValue(<div />);
    vi.mocked(StartTaskTimer).mockReturnValue(<div />);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render Loading component when isLoading is true', () => {
    (useGetTimeEntriesQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<Home />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render null when timeEntries is undefined', () => {
    (useGetTimeEntriesQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    const { container } = render(<Home />);

    expect(container.firstChild).toBeNull();
  });
});
