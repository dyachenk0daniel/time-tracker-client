import { PropsWithChildren } from 'react';
import Container from '@shared/components/container';
import s from './styles.module.scss';

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className={s.layout}>
      <header className={s.header}>
        <Container className={s.headerContainer}>
          <h1 className={s.headerTitle}>Task Tracker</h1>
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
