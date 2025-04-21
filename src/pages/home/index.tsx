import TimeEntryList from '@entities/time-entry/components/time-entry-list';
import TaskTimerControl from '@entities/time-entry/components/task-timer-control';
import Container from '@shared/components/container';
import s from './styles.module.scss';

export function Home() {
  return (
    <Container className={s.homeContainer}>
      <div className={s.taskWrapper}>
        <TaskTimerControl />
        <TimeEntryList />
      </div>
    </Container>
  );
}
