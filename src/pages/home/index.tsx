import TimeEntryList from '@entities/time-entry/components/time-entry-list';
import StartTaskTimer from '@entities/time-entry/components/start-task-timer';
import Container from '@shared/components/container';
import s from './styles.module.scss';

export function Home() {
  return (
    <Container className={s.homeContainer}>
      <div className={s.taskWrapper}>
        <StartTaskTimer />
        <TimeEntryList />
      </div>
    </Container>
  );
}
