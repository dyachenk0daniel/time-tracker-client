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
  onContinueTaskTimer: (description: string) => void;
  onStopTaskTimer: () => void;
  isTimerRunning: boolean;
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
  isTimerRunning,
  onExpandToggle,
  onContinueTaskTimer,
  onStopTaskTimer,
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
  onContinueTaskTimer: (description: string) => void;
  onStopTaskTimer: () => void;
  isTimerRunning?: boolean;
}

function TimeEntryItem({
  description,
  entries,
  isTimerRunning = false,
  onContinueTaskTimer,
  onStopTaskTimer,
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
      />
      {isExpanded && count > 1 && (
        <div className={s.expandedList}>
          {entries.map((original) => (
            <EntryRow
              key={original.id}
              isTimerRunning={isTimerRunning}
              className={s.expandedItem}
              description={original.description}
              startTime={original.startTime}
              endTime={original.endTime}
              duration={TimeEntryUtils.formatEntryDuration(original.startTime, original.endTime)}
              onContinueTaskTimer={onContinueTaskTimer}
              onStopTaskTimer={onStopTaskTimer}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TimeEntryItem;
