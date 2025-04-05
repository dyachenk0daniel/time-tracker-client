import { ComponentProps, PropsWithChildren } from 'react';
import cn from 'classnames';
import s from './styles.module.scss';

interface Props extends ComponentProps<'span'> {
  message: string;
}

function ErrorMessage({ message, className }: PropsWithChildren<Props>) {
  return <span className={cn(s.errorMessage, className)}>{message}</span>;
}

export default ErrorMessage;
