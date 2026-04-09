import { ComponentProps } from 'react';
import cn from 'classnames';
import TimeEntryHelpers from '@entities/time-entry/utils';
import Button from '@shared/components/button';
import PlayIcon from '@shared/components/icons/play-icon';
import StopIcon from '@shared/components/icons/stop-icon';
import TrashIcon from '@shared/components/icons/trash-icon';
import SpinnerIcon from '@shared/components/icons/spinner-icon';
import s from './styles.module.scss';

interface TimeEntryRowProps extends ComponentProps<'div'> {
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
  isExpandLoading?: boolean;
  onExpandToggle?: () => void;
}

export function TimeEntryRow({
  description,
  startTime,
  endTime,
  duration,
  count,
  isExpandable,
  isExpandLoading = false,
  isTimerRunning = false,
  onExpandToggle,
  onContinueTaskTimer,
  onStopTaskTimer,
  onDeleteTimeEntry,
  className,
  ...props
}: TimeEntryRowProps) {
  const hasMultipleEntries = count === undefined || count > 1;
  const isTimerActive = isTimerRunning;
  const canDelete = !!endTime;

  return (
    <div className={cn(s.timeEntryRow, className)} {...props}>
      <div className={s.entryLeft}>
        {isExpandable && hasMultipleEntries && (
          <Button variant="outline" className={s.countButton} onClick={onExpandToggle}>
            {isExpandLoading ? <SpinnerIcon className={s.spinner} /> : (count ?? '…')}
          </Button>
        )}
        {!isExpandable && <span className={s.countPlaceholder}></span>}
        <span className={s.timeEntryName}>{description}</span>
      </div>
      <div className={s.entryRight}>
        <span className={s.timeEntryTime}>
          {TimeEntryHelpers.formatTime(startTime)} - {TimeEntryHelpers.formatTime(endTime)}
        </span>
        <span className={s.verticalDivider}></span>
        <span className={s.duration}>{duration}</span>
        <span className={s.verticalDivider}></span>
        <div className={s.entryActions}>
          {onStopTaskTimer && onContinueTaskTimer && (
            <Button
              variant="ghost"
              className={cn(s.continueButton, { [s.stop]: isTimerActive })}
              onClick={() => (isTimerActive ? onStopTaskTimer() : onContinueTaskTimer(description))}
            >
              {isTimerActive ? <StopIcon className={s.continueIcon} /> : <PlayIcon className={s.continueIcon} />}
            </Button>
          )}
          {onDeleteTimeEntry && (
            <Button disabled={!canDelete} variant="ghost" className={s.deleteButton} onClick={onDeleteTimeEntry}>
              <TrashIcon className={s.continueIcon} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TimeEntryRow;
