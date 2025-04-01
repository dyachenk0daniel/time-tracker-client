import { render, screen } from '@testing-library/react';
import s from './styles.module.scss';
import Button from './index';

describe('Button', () => {
  it('should render children content', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should apply primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toHaveClass(s.button);
    expect(button).toHaveClass(s.primary);
  });

  it('should apply specified variant class', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');
    expect(button).toHaveClass(s.button);
    expect(button).toHaveClass(s.secondary);
    expect(button).not.toHaveClass(s.primary);
  });

  it('should have disabled attribute when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toHaveAttribute('disabled');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByText('Custom Button');
    expect(button).toHaveClass('custom-class');
  });

  it('should pass additional props to button element', () => {
    render(<Button type="submit">Submit Button</Button>);
    const button = screen.getByText('Submit Button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
