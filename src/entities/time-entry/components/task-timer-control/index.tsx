import { ChangeEvent, useEffect, useState } from 'react';
import { useOptimistic } from 'react';
import {
  useCreateTimeEntryMutation,
  useGetActiveTimeEntryQuery,
  useStopTimeEntryMutation,
} from '@entities/time-entry/hooks.ts';
import { handleTimeEntryError } from '@entities/time-entry/handle-error';
import TimeEntryHelpers from '@entities/time-entry/utils.ts';
import { TimeEntry } from '@entities/time-entry/types.ts';
import { ErrorCode } from '@shared/api/error-code.ts';
import Input from '@shared/components/input';
import Button from '@shared/components/button';
import { useNotifications } from '@shared/hooks/use-notifications.ts';
import s from './styles.module.scss';

const INITIAL_DURATION = '--:--:--';
const UNNAMED_TASK_PLACEHOLDER = 'Unnamed task';

function useElapsedTimer(startTime: string | undefined, isActive: boolean): string {
  const [duration, setDuration] = useState(INITIAL_DURATION);

  useEffect(() => {
    if (!isActive) {
      setDuration(INITIAL_DURATION);
      return;
    }

    let frameId: number;

    const tick = () => {
      const now = new Date().toISOString();
      setDuration(TimeEntryHelpers.formatEntryDuration(startTime!, now));
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isActive, startTime]);

  return duration;
}

export function TaskTimerControl() {
  const { mutateAsync: createTimeEntry } = useCreateTimeEntryMutation();
  const { data: activeTimeEntry, isLoading } = useGetActiveTimeEntryQuery();
  const { mutateAsync: stopTimeEntry } = useStopTimeEntryMutation();
  const [timeEntry, setTimeEntry] = useOptimistic<Partial<TimeEntry> | null, Partial<TimeEntry> | null>(
    activeTimeEntry || null,
    (currentTimeEntry, newTimeEntry) => ({ ...currentTimeEntry, ...newTimeEntry })
  );
  const [description, setDescription] = useState('');
  const { success, error: notify } = useNotifications();

  const isActive = !!timeEntry && timeEntry.endTime === null;
  const currentDuration = useElapsedTimer(timeEntry?.startTime, isActive);

  const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const startTimer = async () => {
    try {
      const newTimeEntry = await createTimeEntry(description);
      setTimeEntry(newTimeEntry);
      success('Timer started successfully!');
    } catch (e) {
      handleTimeEntryError(e, 'start timer', notify);
      setTimeEntry(null);
    }
  };

  const stopTimer = async () => {
    try {
      await stopTimeEntry(timeEntry?.id as string);
      setTimeEntry(null);
      success('Timer stopped successfully!');
    } catch (e) {
      handleTimeEntryError(e, 'stop timer', notify, {
        [ErrorCode.TIME_ENTRY_NOT_FOUND]: 'Time entry not found.',
        [ErrorCode.TIME_ENTRY_ALREADY_STOPPED]: 'Time entry is already stopped.',
      });
    }
  };

  const handleStartButtonClick = async () => {
    if (timeEntry) {
      setDescription('');
      return stopTimer();
    }
    return startTimer();
  };

  const taskName = timeEntry?.description || UNNAMED_TASK_PLACEHOLDER;
  const buttonLabel = isLoading ? 'Loading...' : isActive ? 'Stop' : 'Start';
  const buttonVariant = isLoading ? 'secondary' : isActive ? 'danger' : 'primary';
  const isButtonDisabled = isLoading || (!isActive && !description.trim());

  return (
    <div className={s.inputSection}>
      {isActive ? (
        <div className={s.taskDescription} aria-live="polite">
          <span className={s.taskName}>{taskName}</span>
          <span className={s.verticalDivider}></span>
          <span className={s.duration} aria-label={`Elapsed time: ${currentDuration}`}>
            {currentDuration}
          </span>
        </div>
      ) : (
        <Input
          disabled={isActive}
          value={description}
          placeholder="Enter task name"
          className={s.taskInput}
          onChange={handleChangeDescription}
          aria-label="Task description"
        />
      )}
      <Button
        disabled={isButtonDisabled}
        variant={buttonVariant}
        className={s.startButton}
        onClick={handleStartButtonClick}
        aria-label={isActive ? 'Stop timer' : 'Start timer'}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

export default TaskTimerControl;
