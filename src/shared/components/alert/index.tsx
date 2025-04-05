import { ComponentProps, PropsWithChildren } from 'react';
import cn from 'classnames';
import s from './styles.module.scss';

interface Props extends ComponentProps<'div'> {
  variant?: 'success' | 'danger' | 'info' | 'warning';
}

export function Alert({ children, variant = 'danger', className, ...props }: PropsWithChildren<Props>) {
  return (
    <div className={cn(s.alert, s[variant], className)} {...props}>
      <span className={s.message}>{children}</span>
    </div>
  );
}

export default Alert;
