import { useMemo } from 'react';
import { isAxiosError } from 'axios';
import TimeEntryUtils from '@entities/time-entry/utils';
import TimeEntryItem from '@entities/time-entry/components/time-entry-item';
import {
  useCreateTimeEntryMutation,
  useGetActiveTimeEntryQuery,
  useGetTimeEntriesQuery,
  useStopTimeEntryMutation,
} from '@entities/time-entry/hooks.ts';
import Loading from '@shared/components/loading';
import { ApiErrorPayload } from '@shared/api/types.ts';
import { ErrorCode } from '@shared/api/error-code.ts';
import { useNotifications } from '@shared/hooks/use-notifications.ts';
import s from './styles.module.scss';

function TimeEntryList() {
  const { data: timeEntries, isLoading } = useGetTimeEntriesQuery();
  const { data: activeTimeEntry } = useGetActiveTimeEntryQuery();
  const { mutateAsync: createTimeEntry } = useCreateTimeEntryMutation();
  const { mutateAsync: stopTimeEntry } = useStopTimeEntryMutation();
  const groupedEntriesByDescription = useMemo(() => {
    if (!timeEntries) return [];

    return TimeEntryUtils.groupEntriesByDescription(timeEntries);
  }, [timeEntries]);
  const { success, error } = useNotifications();

  if (isLoading) {
    return <Loading data-testid="loading" />;
  }

  if (!timeEntries?.length) {
    return null;
  }

  const handleContinueTaskTimer = async (description: string) => {
    try {
      await createTimeEntry(description);
      success('Timer continued successfully!');
    } catch (e) {
      if (!isAxiosError<ApiErrorPayload>(e)) {
        console.error('Non-API Error during timer continuation:', e);
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
          console.error('API Error during timer continuation:', {
            code: errorCode,
            message: serverMessage,
            status: e.response?.status,
          });
          error(serverMessage || 'Failed to continue timer. Please try again.');
      }
    }
  };

  const handleStopTaskTimer = async () => {
    if (!activeTimeEntry?.id) return;

    try {
      await stopTimeEntry(activeTimeEntry.id);
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

  return (
    <div className={s.entriesList}>
      {groupedEntriesByDescription.map((groupedEntry) => (
        <div key={groupedEntry.description} className={s.entryGroup}>
          <TimeEntryItem
            isTimerRunning={activeTimeEntry?.description === groupedEntry.description}
            description={groupedEntry.description}
            entries={groupedEntry.entries}
            onContinueTaskTimer={handleContinueTaskTimer}
            onStopTaskTimer={handleStopTaskTimer}
          />
        </div>
      ))}
    </div>
  );
}

export default TimeEntryList;
