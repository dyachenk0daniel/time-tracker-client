import TimeEntryList from '@entities/time-entry/components/time-entry-list';
import StartTaskTimer from '@entities/time-entry/components/start-task-timer'; // Новый импорт
import { useGetTimeEntriesQuery } from '@entities/time-entry/hooks.ts';
import Container from '@shared/components/container';
import Loading from '@shared/components/loading';
import s from './styles.module.scss';

export function Home() {
  const { data: timeEntries, isLoading } = useGetTimeEntriesQuery();

  if (isLoading) {
    return <Loading data-testid="loading" />;
  }

  if (!timeEntries) {
    return null;
  }

  return (
    <Container className={s.homeContainer}>
      <div className={s.taskWrapper}>
        <StartTaskTimer />
        <TimeEntryList timeEntries={timeEntries} />
      </div>
    </Container>
  );
}