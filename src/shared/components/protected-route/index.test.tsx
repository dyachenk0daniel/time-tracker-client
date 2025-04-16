import { render, screen } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { Routes } from '@shared/constants';
import * as userHooks from '@entities/user/hooks';
import ProtectedRoute from './index';

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    Navigate: vi.fn(({ to, replace }) => <div data-testid="navigate" data-to={to} data-replace={replace} />),
  };
});

vi.mock('@shared/components/loading', () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}));

vi.mock('@entities/user/hooks', () => ({
  useCurrentUserQuery: vi.fn(),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Loading component when isLoading is true', () => {
    (userHooks.useCurrentUserQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Test Child</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByText('Test Child')).not.toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    (userHooks.useCurrentUserQuery as Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Test Child</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toBeInTheDocument();
    expect(navigate).toHaveAttribute('data-to', Routes.LOGIN);
    expect(navigate).toHaveAttribute('data-replace', 'true');
    expect(screen.queryByText('Test Child')).not.toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    (userHooks.useCurrentUserQuery as Mock).mockReturnValue({
      data: { id: 1, name: 'Test User' },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="child">Test Child</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
    expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
