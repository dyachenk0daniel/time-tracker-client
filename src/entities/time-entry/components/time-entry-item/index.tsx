import { useMemo, useState } from 'react';
import { TimeEntry } from '@entities/time-entry/types';
import TimeEntryUtils from '@entities/time-entry/utils';
import TimeEntryRow from '@entities/time-entry/components/time-entry-row';
import TimeEntryVirtualList from '@entities/time-entry/components/time-entry-virtual-list';
import { useGetGroupEntriesInfiniteQuery } from '@entities/time-entry/hooks';
import s from './styles.module.scss';

interface TimeEntryItemProps {
  groupId: string;
  entriesCount: number;
  entry: TimeEntry | null;
  description: string;
  onContinueTaskTimer: (description: string) => void;
  onStopTaskTimer: () => void;
  onDeleteTimeEntry: (id: string) => void;
  isTimerRunning?: boolean;
}

export function TimeEntryItem({
  groupId,
  entriesCount,
  entry,
  description,
  isTimerRunning = false,
  onContinueTaskTimer,
  onStopTaskTimer,
  onDeleteTimeEntry,
}: TimeEntryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetGroupEntriesInfiniteQuery(
    groupId,
    { enabled: isExpanded }
  );

  const allEntries = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);
  const timeRangeSummary = useMemo(
    () =>
      entriesCount === 1 && entry
        ? { startDate: entry.startTime, endDate: entry.endTime }
        : TimeEntryUtils.getTimeRangeSummary(allEntries),
    [entriesCount, entry, allEntries]
  );
  const duration = useMemo(
    () =>
      entriesCount === 1 && entry
        ? TimeEntryUtils.formatEntryDuration(entry.startTime, entry.endTime)
        : TimeEntryUtils.summarizeEntriesDuration(allEntries),
    [entriesCount, entry, allEntries]
  );

  return (
    <div>
      <TimeEntryRow
        isExpandable
        isTimerRunning={isTimerRunning}
        className={s.timeEntryItem}
        description={description}
        startTime={timeRangeSummary.startDate}
        endTime={timeRangeSummary.endDate}
        duration={duration}
        count={entriesCount}
        isExpandLoading={isExpanded && isFetching && !data}
        onExpandToggle={() => setIsExpanded(!isExpanded)}
        onContinueTaskTimer={onContinueTaskTimer}
        onStopTaskTimer={onStopTaskTimer}
        onDeleteTimeEntry={entriesCount === 1 && entry ? () => onDeleteTimeEntry(entry.id) : undefined}
      />
      {isExpanded && entriesCount > 1 && (
        <TimeEntryVirtualList
          entries={allEntries}
          description={description}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onFetchNextPage={fetchNextPage}
          onDeleteTimeEntry={onDeleteTimeEntry}
        />
      )}
    </div>
  );
}

export default TimeEntryItem;
