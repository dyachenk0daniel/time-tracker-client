import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { TimeEntry } from '@entities/time-entry/types';
import TimeEntryUtils from '@entities/time-entry/utils';
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

  useEffect(() => {
    const lastItem = virtualizer.getVirtualItems().at(-1);
    if (!lastItem) return;
    if (lastItem.index >= entries.length - 1 && hasNextPage && !isFetchingNextPage) {
      onFetchNextPage();
    }
  }, [virtualizer.getVirtualItems(), entries.length, hasNextPage, isFetchingNextPage, onFetchNextPage]);

  return (
    <div ref={parentRef} className={s.virtualList}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
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
                  duration={TimeEntryUtils.formatEntryDuration(entry.startTime, entry.endTime)}
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
