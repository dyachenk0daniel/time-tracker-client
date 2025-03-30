import { ComponentProps, PropsWithChildren } from 'react';
import cn from 'classnames';
import s from './styles.module.scss';

interface Props extends ComponentProps<'div'> {
  fluid?: boolean;
  centerContent?: boolean;
}

function Container({ children, className, fluid = false, centerContent = false }: PropsWithChildren<Props>) {
  return (
    <div
      className={cn(
        s.container,
        {
          [s.fluid]: fluid,
          [s.centerContent]: centerContent,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

export default Container;
