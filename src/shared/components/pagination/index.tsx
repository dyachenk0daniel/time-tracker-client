import React from 'react';
import cn from 'classnames';
import ArrowLeftIcon from '@shared/components/icons/arrow-left-icon.tsx';
import ArrowRightIcon from '@shared/components/icons/arrow-right-icon.tsx';
import s from './styles.module.scss';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  ariaLabel?: string;
  className?: string;
  totalItems?: number;
  limit?: number;
};

type PageToken = number | 'ellipsis';

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

function buildPagination(current: number, total: number, siblingCount: number): PageToken[] {
  if (total <= 0) return [];
  if (total === 1) return [1];

  const left = Math.max(2, current - siblingCount);
  const right = Math.min(total - 1, current + siblingCount);

  const tokens: PageToken[] = [1];

  if (left > 2) tokens.push('ellipsis');
  tokens.push(...range(left, right));

  if (right < total - 1) tokens.push('ellipsis');
  tokens.push(total);

  const normalized: PageToken[] = [];
  let prevNum: number | null = null;

  for (const t of tokens) {
    if (t === 'ellipsis') {
      if (normalized[normalized.length - 1] !== 'ellipsis') normalized.push('ellipsis');
      continue;
    }
    if (prevNum === null || t !== prevNum) {
      normalized.push(t);
      prevNum = t;
    }
  }
  return normalized;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  ariaLabel,
  className,
  totalItems,
  limit,
}) => {
  const current = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const total = Math.max(1, totalPages);

  const tokens = buildPagination(current, total, siblingCount);

  const goTo = (page: number) => {
    const p = Math.min(Math.max(1, page), total);
    if (p !== current) onPageChange(p);
  };

  const getRecordsInfo = (): string => {
    if (!limit || !totalItems) return '';
    const from = (current - 1) * limit + 1;
    const to = Math.min(current * limit, totalItems);
    return `${from}–${to} of ${totalItems}`;
  };

  return (
    <nav aria-label={ariaLabel ?? 'Pagination'} className={cn(s.container, className)}>
      {limit && totalItems && <div className={s.recordsInfo}>{getRecordsInfo()}</div>}
      {totalPages > 1 && (
        <ul role="list" className={s.list}>
          <li>
            <button
              type="button"
              aria-label="Previous page"
              disabled={current === 1}
              onClick={() => goTo(current - 1)}
              className={s.button}
            >
              <ArrowLeftIcon />
            </button>
          </li>

          {tokens.map((t, idx) =>
            t === 'ellipsis' ? (
              <li key={`e-${idx}`} aria-hidden className={s.ellipsis}>
                …
              </li>
            ) : (
              <li key={t}>
                <button
                  type="button"
                  onClick={() => goTo(t)}
                  aria-current={t === current ? 'page' : undefined}
                  className={cn(s.page, { [s.active]: t === current })}
                >
                  {t}
                </button>
              </li>
            )
          )}

          <li>
            <button
              type="button"
              aria-label="Next page"
              disabled={current === total}
              onClick={() => goTo(current + 1)}
              className={s.button}
            >
              <ArrowRightIcon />
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Pagination;
