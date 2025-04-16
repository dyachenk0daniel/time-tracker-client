import { ComponentProps } from 'react';
import cn from 'classnames';
import s from './styles.module.scss';

function Loading({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn(s.loadingContainer, className)} role="status" aria-label="Loading" {...props}>
      <svg className={s.spinner} viewBox="0 0 50 50">
        <circle className={s.path} cx="25" cy="25" r="20" fill="none" strokeWidth="5" />
      </svg>
      <p className={s.loadingText}>Loading...</p>
    </div>
  );
}

export default Loading;
