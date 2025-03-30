import { fireEvent, render, screen } from '@testing-library/react';
import { GlobalErrorBoundary } from './index';

function ProblemChild() {
  throw new Error('Test error');

  return <div />;
}

describe('GlobalErrorBoundary', () => {
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...originalLocation, reload: vi.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalLocation,
    });
  });

  it('should render children when there is no error', () => {
    render(
      <GlobalErrorBoundary>
        <div>Normal content</div>
      </GlobalErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('should display fallback UI when an error is thrown', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <GlobalErrorBoundary>
        <ProblemChild />
      </GlobalErrorBoundary>
    );

    // Проверяем, что отображается fallback UI
    expect(screen.getByText(/Oops! Something Went Wrong/i)).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/i)).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it('should call window.location.reload when the reload button is clicked', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadSpy = vi.spyOn(window.location, 'reload').mockImplementation(() => {});

    render(
      <GlobalErrorBoundary>
        <ProblemChild />
      </GlobalErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: /Reload Application/i });
    fireEvent.click(reloadButton);

    expect(reloadSpy).toHaveBeenCalled();

    reloadSpy.mockRestore();
    consoleError.mockRestore();
  });
});
