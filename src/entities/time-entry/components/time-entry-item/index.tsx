import { useMemo, useState } from 'react';
import { TimeEntryResponse } from '@entities/time-entry/types';
import TimeEntryUtils from '@entities/time-entry/utils';
import TimeEntryRow from '@entities/time-entry/components/time-entry-row';
import s from './styles.module.scss';

interface TimeEntryItemProps {
  description: string;
  entries: TimeEntryResponse[];
  onContinueTaskTimer: (description: string) => void;
  onStopTaskTimer: () => void;
  onDeleteTimeEntry: (id: string) => void;
  isTimerRunning?: boolean;
}

export function TimeEntryItem({
  description,
  entries,
  isTimerRunning = false,
  onContinueTaskTimer,
  onStopTaskTimer,
  onDeleteTimeEntry,
}: TimeEntryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeRangeSummary = useMemo(() => TimeEntryUtils.getTimeRangeSummary(entries), [entries]);
  const count = entries?.length;

  return (
    <div>
      <TimeEntryRow
        isExpandable
        isTimerRunning={isTimerRunning}
        className={s.timeEntryItem}
        description={description}
        startTime={timeRangeSummary.startDate}
        endTime={timeRangeSummary.endDate}
        duration={TimeEntryUtils.summarizeEntriesDuration(entries)}
        count={count}
        onExpandToggle={() => setIsExpanded(!isExpanded)}
        onContinueTaskTimer={onContinueTaskTimer}
        onStopTaskTimer={onStopTaskTimer}
        onDeleteTimeEntry={count === 1 ? () => onDeleteTimeEntry(entries[0].id) : undefined}
      />
      {isExpanded && count > 1 && (
        <div className={s.expandedList}>
          {entries.map((original) => (
            <TimeEntryRow
              key={original.id}
              className={s.expandedItem}
              description={original.description}
              startTime={original.startTime}
              endTime={original.endTime}
              duration={TimeEntryUtils.formatEntryDuration(original.startTime, original.endTime)}
              onDeleteTimeEntry={() => onDeleteTimeEntry(original.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TimeEntryItem;
