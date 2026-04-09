import { SVGProps } from 'react';
import cn from 'classnames';
import s from './spinner-icon.module.scss';

function SpinnerIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cn(s.spinner, className)} {...props}>
      <circle className={s.spinnerPath} cx="10" cy="10" r="7" strokeWidth="2.5" />
    </svg>
  );
}

export default SpinnerIcon;
