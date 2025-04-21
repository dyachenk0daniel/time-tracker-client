import { PropsWithChildren } from 'react';
import Container from '@shared/components/container';
import TimeClockIcon from '@shared/components/icons/time-clock';
import s from './styles.module.scss';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className={s.layout}>
      <header className={s.header}>
        <Container className={s.headerContainer}>
          <div className={s.titleContainer}>
            <h1 className={s.headerTitle}>Time Tracker</h1>
            <TimeClockIcon className={s.headerIcon} />
          </div>
          <nav className={s.nav}>
            <button className={s.logoutButton}>Logout</button>
          </nav>
        </Container>
      </header>
      <main className={s.main}>{children}</main>
    </div>
  );
}

export default Layout;
