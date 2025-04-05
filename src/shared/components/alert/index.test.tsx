import { render, screen } from '@testing-library/react';
import s from './styles.module.scss';
import Alert from './index';

describe('Alert', () => {
  it('should render children content', () => {
    render(<Alert>Test Alert</Alert>);
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
  });

  it('should apply the "danger" variant by default', () => {
    render(<Alert>Default Alert</Alert>);
    const alert = screen.getByText('Default Alert');
    expect(alert.parentElement).toHaveClass(s.alert);
    expect(alert.parentElement).toHaveClass(s.danger);
  });

  it('should apply the specified variant class', () => {
    render(<Alert variant="success">Success Alert</Alert>);
    const alert = screen.getByText('Success Alert');
    expect(alert.parentElement).toHaveClass(s.alert);
    expect(alert.parentElement).toHaveClass(s.success);
    expect(alert.parentElement).not.toHaveClass(s.danger);
  });

  it('should apply custom className', () => {
    render(<Alert className="custom-alert">Custom Alert</Alert>);
    const alert = screen.getByText('Custom Alert');
    expect(alert.parentElement).toHaveClass('custom-alert');
  });

  it('should pass additional props to the div element', () => {
    render(<Alert role="alert">Role Alert</Alert>);
    const alert = screen.getByText('Role Alert');
    expect(alert.parentElement).toHaveAttribute('role', 'alert');
  });
});
