import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Container from './index';

describe('Container', () => {
  it('should render children content', () => {
    render(<Container>Test Content</Container>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply additional class names and modifiers', () => {
    render(
      <Container fluid centerContent className="custom-class">
        Test Content
      </Container>
    );

    const element = screen.getByText('Test Content');
    expect(element).toHaveClass('custom-class');

    expect(element?.className).toMatch(/fluid/);
    expect(element?.className).toMatch(/centerContent/);
  });
});
