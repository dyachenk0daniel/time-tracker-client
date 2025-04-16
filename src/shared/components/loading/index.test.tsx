import { render, screen } from '@testing-library/react';
import Loading from './index';

describe('Loading', () => {
  it('should render the loading spinner and text', () => {
    render(<Loading />);
    const loadingContainer = screen.getByRole('status');
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveAttribute('aria-label', 'Loading');
    const text = screen.getByText('Loading...');
    expect(text).toBeInTheDocument();
  });
});
