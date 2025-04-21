import { ComponentProps, useMemo, useState } from 'react';
import cn from 'classnames';
import { TimeEntryResponse } from '@entities/time-entry/types.ts';
import TimeEntryUtils from '@entities/time-entry/utils';
import Button from '@shared/components/button';
import s from './styles.module.scss';

interface EntryRowProps extends ComponentProps<'div'> {
  description: string;
  startTime: string | null;
  endTime: string | null;
  duration: string;
  onContinueTaskTimer?: (description: string) => void;
  onStopTaskTimer?: () => void;
  onDeleteTimeEntry?: () => void;
  isTimerRunning?: boolean;
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
  isTimerRunning = false,
  onExpandToggle,
  onContinueTaskTimer,
  onStopTaskTimer,
  onDeleteTimeEntry,
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
          {onStopTaskTimer && onContinueTaskTimer && (
            <Button
              variant="ghost"
              className={cn(s.continueButton, { [s.stop]: isTimerRunning })}
              onClick={() => (isTimerRunning ? onStopTaskTimer?.() : onContinueTaskTimer?.(description))}
            >
              {isTimerRunning ? (
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
                  <rect x="6" y="4" width="12" height="16" rx="1" />
                </svg>
              ) : (
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
              )}
            </Button>
          )}
          {onDeleteTimeEntry && (
            <Button disabled={!endTime} variant="ghost" className={s.deleteButton} onClick={onDeleteTimeEntry}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className={s.deleteIcon}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <path d="M5 6l1 16h12l1-16" />
              </svg>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface TimeEntryItemProps {
  description: string;
  entries: TimeEntryResponse[];
  onContinueTaskTimer: (description: string) => void;
  onStopTaskTimer: () => void;
  onDeleteTimeEntry: (id: string) => void;
  isTimerRunning?: boolean;
}

function TimeEntryItem({
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
      <EntryRow
        isExpandable
        isTimerRunning={isTimerRunning}
        className={s.entryItem}
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
            <EntryRow
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
