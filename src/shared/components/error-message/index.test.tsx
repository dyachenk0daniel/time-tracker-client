import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ErrorMessage from './index';
import s from './styles.module.scss';

describe('ErrorMessage', () => {
  const testMessage = 'This is an error message';

  it('should render the error message correctly', () => {
    render(<ErrorMessage message={testMessage} />);
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  it('should apply the default error message class', () => {
    render(<ErrorMessage message={testMessage} />);
    const errorMessageElement = screen.getByText(testMessage);
    expect(errorMessageElement).toHaveClass(s.errorMessage);
  });

  it('should apply additional className when provided', () => {
    const customClass = 'my-custom-error-class';
    render(<ErrorMessage message={testMessage} className={customClass} />);
    const errorMessageElement = screen.getByText(testMessage);
    expect(errorMessageElement).toHaveClass(s.errorMessage);
    expect(errorMessageElement).toHaveClass(customClass);
  });

  it('should render as a span element', () => {
    render(<ErrorMessage message={testMessage} />);
    const errorMessageElement = screen.getByText(testMessage);
    expect(errorMessageElement.tagName).toBe('SPAN');
  });
});
