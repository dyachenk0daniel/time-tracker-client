import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './index';
import s from './styles.module.scss';

describe('Input', () => {
  it('should render an input element', () => {
    render(<Input />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });

  it('should apply the base input class', () => {
    render(<Input />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass(s.input);
  });

  it('should pass standard input attributes', () => {
    const placeholderText = 'Enter text here';
    const inputType = 'email';
    const inputValue = 'test@example.com';
    const inputId = 'test-input';

    render(<Input placeholder={placeholderText} type={inputType} value={inputValue} id={inputId} readOnly />);

    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveAttribute('placeholder', placeholderText);
    expect(inputElement).toHaveAttribute('type', inputType);
    expect(inputElement).toHaveAttribute('id', inputId);
    expect(inputElement).toHaveValue(inputValue);
  });

  it('should apply the error class when isError is true', () => {
    render(<Input isError />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass(s.input);
    expect(inputElement).toHaveClass(s.error);
  });

  it('should not apply the error class when isError is false or omitted', () => {
    const { rerender } = render(<Input />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass(s.input);
    expect(inputElement).not.toHaveClass(s.error);

    rerender(<Input isError={false} />);
    const inputElementAfterRerender = screen.getByRole('textbox');
    expect(inputElementAfterRerender).toHaveClass(s.input);
    expect(inputElementAfterRerender).not.toHaveClass(s.error);
  });

  it('should apply additional className when provided', () => {
    const customClass = 'my-custom-input';
    render(<Input className={customClass} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass(s.input);
    expect(inputElement).toHaveClass(customClass);
  });

  it('should call onChange handler when text is typed', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input onChange={handleChange} />);
    const inputElement = screen.getByRole('textbox');

    await user.type(inputElement, 'Hello');

    expect(handleChange).toHaveBeenCalledTimes(5);
    expect(inputElement).toHaveValue('Hello');
  });

  it('should call onBlur handler when input loses focus', async () => {
    const handleBlur = vi.fn();
    const user = userEvent.setup();
    render(<Input onBlur={handleBlur} />);
    const inputElement = screen.getByRole('textbox');

    await user.click(inputElement);
    await user.tab();

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeDisabled();
  });
});
