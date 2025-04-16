import { ComponentProps, PropsWithChildren } from 'react';
import cn from 'classnames';
import s from './styles.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';

interface Props extends ComponentProps<'button'> {
  variant?: ButtonVariant;
}

function Button({ children, className, variant = 'primary', ...props }: PropsWithChildren<Props>) {
  return (
    <button
      className={cn(
        s.button,
        {
          [s.primary]: variant === 'primary',
          [s.secondary]: variant === 'secondary',
          [s.success]: variant === 'success',
          [s.danger]: variant === 'danger',
          [s.outline]: variant === 'outline',
          [s.ghost]: variant === 'ghost',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
