import { TimeEntryResponse } from '@entities/time-entry/types.ts';
import s from './styles.module.scss';
import { useMemo } from 'react';
import TimeEntryUtils from '@entities/time-entry/utils';
import TimeEntryItem from '@entities/time-entry/components/time-entry-item';

interface TimeEntryListProps {
  timeEntries: TimeEntryResponse[];
}

function TimeEntryList({ timeEntries }: TimeEntryListProps) {
  const groupEntriesByDescription = useMemo(() => TimeEntryUtils.groupEntriesByDescription(timeEntries), [timeEntries]);

  return (
    <div className={s.entriesList}>
      {groupEntriesByDescription.map((groupedEntry) => (
        <div key={groupedEntry.description} className={s.entryGroup}>
          <TimeEntryItem description={groupedEntry.description} entries={groupedEntry.entries} />
        </div>
      ))}
    </div>
  );
}

export default TimeEntryList;
