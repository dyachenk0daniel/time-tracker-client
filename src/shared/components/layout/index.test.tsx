import { render, screen } from '@testing-library/react';
import Layout from './index';
import s from './styles.module.scss';

vi.mock('@shared/components/container', () => ({
  default: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="mock-container">
      {children}
    </div>
  ),
}));

describe('Layout', () => {
  it('should render header, main, and children correctly', () => {
    const testChildren = <div data-testid="test-child">Test Content</div>;
    render(<Layout>{testChildren}</Layout>);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass(s.header);

    const title = screen.getByRole('heading', { name: /task tracker/i });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass(s.headerTitle);

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveClass(s.nav);

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();
    expect(logoutButton).toHaveClass(s.logoutButton);

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass(s.main);

    const child = screen.getByTestId('test-child');
    expect(child).toBeInTheDocument();
    expect(main).toContainElement(child);
  });

  it('should apply correct layout class to root div', () => {
    render(<Layout>Content</Layout>);
    const layoutDiv = screen.getByRole('banner').parentElement;
    expect(layoutDiv).toHaveClass(s.layout);
  });

  it('should render Container with correct class in header', () => {
    render(<Layout>Content</Layout>);
    const container = screen.getByTestId('mock-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(s.headerContainer);
  });

  it('should render without children', () => {
    render(<Layout />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toBeEmptyDOMElement();
  });
});
