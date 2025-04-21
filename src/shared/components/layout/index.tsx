import { PropsWithChildren } from 'react';
import Container from '@shared/components/container';
import TimeClockIcon from '@shared/components/icons/time-clock';
import AuthService from '@entities/user/auth-service.ts';
import Button from '@shared/components/button';
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
            <Button variant="ghost" className={s.logoutButton} onClick={() => AuthService.logout()}>
              Logout
            </Button>
          </nav>
        </Container>
      </header>
      <main className={s.main}>{children}</main>
    </div>
  );
}

export default Layout;
