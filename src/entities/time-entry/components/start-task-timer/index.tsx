// file: src/entities/time-entry/components/start-task-timer/index.tsx
import { ChangeEvent, useEffect, useOptimistic, useState } from 'react';
import {
  useCreateTimeEntryMutation,
  useGetActiveTimeEntryQuery,
  useStopTimeEntryMutation,
} from '@entities/time-entry/hooks';
import { useCurrentUserQuery } from '@entities/user/hooks';
import { TimeEntryResponse } from '@entities/time-entry/types';
import TimeEntryUtils from '@entities/time-entry/utils';
import Input from '@shared/components/input';
import Button from '@shared/components/button';
import s from './styles.module.scss';

export function StartTaskTimer() {
  const { data: user } = useCurrentUserQuery();
  const { mutateAsync: createTimeEntry } = useCreateTimeEntryMutation();
  const { data: activeTimeEntry, isLoading } = useGetActiveTimeEntryQuery();
  const { mutateAsync: stopTimeEntry } = useStopTimeEntryMutation();
  const [timeEntry, setTimeEntry] = useOptimistic<Partial<TimeEntryResponse> | null, Partial<TimeEntryResponse> | null>(
    activeTimeEntry || null,
    (currentTimeEntry, newTimeEntry) => ({ ...currentTimeEntry, ...newTimeEntry })
  );
  const [description, setDescription] = useState('');
  const [currentDuration, setCurrentDuration] = useState('--:--:--');

  const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const startTimer = async () => {
    try {
      const newEntry = {
        userId: user?.id as string,
        description,
      };
      const newTimeEntry = await createTimeEntry(newEntry);
      setTimeEntry(newTimeEntry);
    } catch (error) {
      setTimeEntry(null);
      console.error(error);
    }
  };

  const stopTimer = async () => {
    try {
      setTimeEntry(null);
      return stopTimeEntry(timeEntry?.id as string);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartButtonClick = async () => {
    if (timeEntry) {
      setDescription('');
      return stopTimer();
    }

    return startTimer();
  };

  const isActive = !!timeEntry && timeEntry?.endTime === null;

  useEffect(() => {
    if (!isActive) {
      setCurrentDuration('--:--:--');
      return;
    }

    let animationFrameId: number;
    const updateTimer = () => {
      const now = new Date().toISOString();
      const duration = TimeEntryUtils.formatEntryDuration(timeEntry?.startTime as string, now);
      setCurrentDuration(duration);
      animationFrameId = requestAnimationFrame(updateTimer);
    };

    animationFrameId = requestAnimationFrame(updateTimer);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive, timeEntry?.startTime]);

  return (
    <div className={s.inputSection}>
      {isActive ? (
        <div className={s.taskDescription} aria-live="polite">
          <span className={s.taskName}>{timeEntry?.description || 'Unnamed task'}</span>
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
        disabled={isLoading || !user?.id}
        variant={isLoading ? 'secondary' : !isActive ? 'primary' : 'danger'}
        className={s.startButton}
        onClick={handleStartButtonClick}
        aria-label={isActive ? 'Stop timer' : 'Start timer'}
      >
        {isLoading ? 'Loading...' : !isActive ? 'Start' : 'Stop'}
      </Button>
    </div>
  );
}

export default StartTaskTimer;
