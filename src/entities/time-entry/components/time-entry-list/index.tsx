import { useState } from 'react';
import TimeEntryItem from '@entities/time-entry/components/time-entry-item';
import {
  useCreateTimeEntryMutation,
  useDeleteTimeEntryMutation,
  useGetActiveTimeEntryQuery,
  useGetTimeEntriesQuery,
  useStopTimeEntryMutation,
} from '@entities/time-entry/hooks.ts';
import { GROUPS_LIMIT } from '@entities/time-entry/constants';
import { handleTimeEntryError } from '@entities/time-entry/handle-error';
import { ErrorCode } from '@shared/api/error-code';
import Loading from '@shared/components/loading';
import Pagination from '@shared/components/pagination';
import { useNotifications } from '@shared/hooks/use-notifications.ts';
import s from './styles.module.scss';

function isGroupTimerRunning(groupId: string, activeEntry: { groupId: string } | undefined): boolean {
  return activeEntry?.groupId === groupId;
}

function TimeEntryList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetTimeEntriesQuery(page, GROUPS_LIMIT);
  const { data: activeTimeEntry } = useGetActiveTimeEntryQuery();
  const { mutateAsync: createTimeEntry } = useCreateTimeEntryMutation();
  const { mutateAsync: stopTimeEntry } = useStopTimeEntryMutation();
  const { mutateAsync: deleteTimeEntry } = useDeleteTimeEntryMutation();
  const { success, error: notify } = useNotifications();

  if (isLoading) {
    return <Loading data-testid="loading" />;
  }

  if (!data?.items.length) {
    return null;
  }

  const totalPages = Math.ceil((data.total ?? 0) / GROUPS_LIMIT);

  const handleContinueTaskTimer = async (description: string) => {
    try {
      await createTimeEntry(description);
      success('Timer continued successfully!');
    } catch (e) {
      handleTimeEntryError(e, 'continue timer', notify);
    }
  };

  const handleStopTaskTimer = async () => {
    if (!activeTimeEntry?.id) return;
    try {
      await stopTimeEntry(activeTimeEntry.id);
      success('Timer stopped successfully!');
    } catch (e) {
      handleTimeEntryError(e, 'stop timer', notify, {
        [ErrorCode.TIME_ENTRY_NOT_FOUND]: 'Time entry not found.',
        [ErrorCode.TIME_ENTRY_ALREADY_STOPPED]: 'Time entry is already stopped.',
      });
    }
  };

  const handleDeleteTaskTimer = async (id: string) => {
    try {
      await deleteTimeEntry(id);
      success('Timer deleted successfully!');
    } catch (e) {
      handleTimeEntryError(e, 'delete timer', notify, {
        [ErrorCode.TIME_ENTRY_NOT_FOUND]: 'Time entry not found.',
      });
    }
  };

  return (
    <div className={s.entriesList}>
      {data.items.map((group) => (
        <div key={group.id} className={s.entryGroup}>
          <TimeEntryItem
            groupId={group.id}
            entriesCount={group.entriesCount}
            startTime={group.startTime}
            endTime={group.endTime}
            entry={group.entry}
            isTimerRunning={isGroupTimerRunning(group.id, activeTimeEntry)}
            description={group.description}
            onContinueTaskTimer={handleContinueTaskTimer}
            onStopTaskTimer={handleStopTaskTimer}
            onDeleteTimeEntry={handleDeleteTaskTimer}
          />
        </div>
      ))}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={data.total}
        limit={GROUPS_LIMIT}
        onPageChange={setPage}
      />
    </div>
  );
}

export default TimeEntryList;
