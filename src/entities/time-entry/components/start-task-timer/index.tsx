import { ChangeEvent, useEffect, useOptimistic, useState } from 'react';
import {
  useCreateTimeEntryMutation,
  useGetActiveTimeEntryQuery,
  useStopTimeEntryMutation,
} from '@entities/time-entry/hooks';
import { TimeEntryResponse } from '@entities/time-entry/types';
import TimeEntryUtils from '@entities/time-entry/utils';
import Input from '@shared/components/input';
import Button from '@shared/components/button';
import s from './styles.module.scss';
import { useNotifications } from '@shared/hooks/use-notifications.ts';
import { isAxiosError } from 'axios';
import { ApiErrorPayload } from '@shared/api/types.ts';
import { ErrorCode } from '@shared/api/error-code.ts';

export function StartTaskTimer() {
  const { mutateAsync: createTimeEntry } = useCreateTimeEntryMutation();
  const { data: activeTimeEntry, isLoading } = useGetActiveTimeEntryQuery();
  const { mutateAsync: stopTimeEntry } = useStopTimeEntryMutation();
  const [timeEntry, setTimeEntry] = useOptimistic<Partial<TimeEntryResponse> | null, Partial<TimeEntryResponse> | null>(
    activeTimeEntry || null,
    (currentTimeEntry, newTimeEntry) => ({ ...currentTimeEntry, ...newTimeEntry })
  );
  const [description, setDescription] = useState('');
  const [currentDuration, setCurrentDuration] = useState('--:--:--');
  const { success, error } = useNotifications();

  const handleChangeDescription = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const startTimer = async () => {
    try {
      const newTimeEntry = await createTimeEntry(description);
      setTimeEntry(newTimeEntry);
      success('Timer started successfully!');
    } catch (e) {
      if (!isAxiosError<ApiErrorPayload>(e)) {
        console.error('Non-API Error during timer start:', e);
        error('An unexpected error occurred. Please try again.');
        return;
      }

      const errorCode = e.response?.data.code;
      const serverMessage = e.response?.data.message;

      switch (errorCode) {
        case ErrorCode.INTERNAL_SERVER_ERROR:
          error('An internal server error occurred. Please try again later.');
          break;
        default:
          console.error('API Error during timer start:', {
            code: errorCode,
            message: serverMessage,
            status: e.response?.status,
          });
          error(serverMessage || 'Failed to start timer. Please try again.');
      }

      setTimeEntry(null);
    }
  };

  const stopTimer = async () => {
    try {
      await stopTimeEntry(timeEntry?.id as string);
      setTimeEntry(null);
      success('Timer stopped successfully!');
    } catch (e) {
      if (!isAxiosError<ApiErrorPayload>(e)) {
        console.error('Non-API Error during timer stop:', e);
        error('An unexpected error occurred. Please try again.');
        return;
      }

      const errorCode = e.response?.data.code;
      const serverMessage = e.response?.data.message;

      switch (errorCode) {
        case ErrorCode.TIME_ENTRY_NOT_FOUND:
          error('Time entry not found.');
          break;
        case ErrorCode.TIME_ENTRY_ALREADY_STOPPED:
          error('Time entry is already stopped.');
          break;
        case ErrorCode.INTERNAL_SERVER_ERROR:
          error('An internal server error occurred. Please try again later.');
          break;
        default:
          console.error('API Error during timer stop:', {
            code: errorCode,
            message: serverMessage,
            status: e.response?.status,
          });
          error(serverMessage || 'Failed to stop timer. Please try again.');
      }
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
        disabled={isLoading || (!isActive && !description.trim())}
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
