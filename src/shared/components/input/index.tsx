import { ComponentProps } from 'react';
import cn from 'classnames';
import s from './styles.module.scss';

interface Props extends ComponentProps<'input'> {
  isError?: boolean;
}

function Input({ className, isError = false, ...props }: Props) {
  return <input className={cn(s.input, { [s.error]: isError }, className)} {...props} />;
}

export default Input;
