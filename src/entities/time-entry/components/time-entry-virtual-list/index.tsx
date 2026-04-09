import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TimeEntry } from '@entities/time-entry/types';
import TimeEntryHelpers from '@entities/time-entry/utils';
import TimeEntryRow from '@entities/time-entry/components/time-entry-row';
import s from './styles.module.scss';

interface TimeEntryVirtualListProps {
  entries: TimeEntry[];
  description: string;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  onDeleteTimeEntry: (id: string) => void;
}

function useInfiniteScrollTrigger(
  virtualItems: Array<{ index: number }>,
  entriesLength: number,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  onFetchNextPage: () => void
): void {
  useEffect(() => {
    const lastItem = virtualItems.at(-1);
    if (!lastItem) return;

    const isNearEnd = lastItem.index >= entriesLength - 1;
    const canFetch = hasNextPage && !isFetchingNextPage;

    if (isNearEnd && canFetch) {
      onFetchNextPage();
    }
  }, [virtualItems, entriesLength, hasNextPage, isFetchingNextPage, onFetchNextPage]);
}

export function TimeEntryVirtualList({
  entries,
  description,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onDeleteTimeEntry,
}: TimeEntryVirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowCount = hasNextPage ? entries.length + 1 : entries.length;

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useInfiniteScrollTrigger(virtualItems, entries.length, hasNextPage, isFetchingNextPage, onFetchNextPage);

  return (
    <div ref={parentRef} className={s.virtualList}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualItems.map((virtualItem) => {
          const isLoaderRow = virtualItem.index >= entries.length;
          const entry = entries[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {isLoaderRow ? (
                <div className={s.loadingRow}>Loading...</div>
              ) : (
                <TimeEntryRow
                  className={s.entryItem}
                  description={description}
                  startTime={entry.startTime}
                  endTime={entry.endTime}
                  duration={TimeEntryHelpers.formatEntryDuration(entry.startTime, entry.endTime)}
                  onDeleteTimeEntry={() => onDeleteTimeEntry(entry.id)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimeEntryVirtualList;
