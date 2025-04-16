import { ComponentProps, useMemo, useState } from 'react';
import { TimeEntryResponse } from '@entities/time-entry/types.ts';
import TimeEntryUtils from '@entities/time-entry/utils';
import Button from '@shared/components/button';
import s from './styles.module.scss';

interface EntryRowProps extends ComponentProps<'div'> {
  description: string;
  startTime: string | null;
  endTime: string | null;
  duration: string;
  count?: number;
  isExpandable?: boolean;
  onExpandToggle?: () => void;
}

function EntryRow({
  description,
  startTime,
  endTime,
  duration,
  count,
  isExpandable,
  onExpandToggle,
  ...props
}: EntryRowProps) {
  return (
    <div {...props}>
      <div className={s.entryLeft}>
        {isExpandable && count && count > 1 && (
          <Button variant="outline" className={s.countButton} onClick={onExpandToggle}>
            {count}
          </Button>
        )}
        {!isExpandable && <span className={s.countPlaceholder}></span>}
        <span className={s.taskName}>{description}</span>
      </div>
      <div className={s.entryRight}>
        <span className={s.taskTime}>
          {TimeEntryUtils.formatTime(startTime)} - {TimeEntryUtils.formatTime(endTime)}
        </span>
        <span className={s.verticalDivider}></span>
        <span className={s.duration}>{duration}</span>
        <span className={s.verticalDivider}></span>
        <div className={s.entryActions}>
          <Button variant="ghost" className={s.continueButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={s.continueIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
          </Button>
          <Button variant="ghost" className={s.menuButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className={s.menuIcon}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

interface TimeEntryItemProps {
  description: string;
  entries: TimeEntryResponse[];
}

function TimeEntryItem({ description, entries }: TimeEntryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const timeRangeSummary = useMemo(() => TimeEntryUtils.getTimeRangeSummary(entries), [entries]);
  const count = entries?.length;

  return (
    <div>
      <EntryRow
        isExpandable
        className={s.entryItem}
        description={description}
        startTime={timeRangeSummary.startDate}
        endTime={timeRangeSummary.endDate}
        duration={TimeEntryUtils.summarizeEntriesDuration(entries)}
        count={count}
        onExpandToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && count > 1 && (
        <div className={s.expandedList}>
          {entries.map((original) => (
            <EntryRow
              key={original.id}
              className={s.expandedItem}
              description={original.description}
              startTime={original.startTime}
              endTime={original.endTime}
              duration={TimeEntryUtils.formatEntryDuration(original.startTime, original.endTime)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TimeEntryItem;
