import { useNavigate } from 'react-router';
import Container from '@shared/components/container';
import Button from '@shared/components/button';
import s from './styles.module.scss';

function NotFound() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container centerContent className={s.notFoundContainer}>
      <div className={s.errorIconWrapper}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={s.errorIcon}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h1 className={s.title}>404</h1>
      <p className={s.message}>Page Not Found</p>
      <p className={s.description}>
        The page you are looking for might have been removed or relocated. Please check the URL or return to the
        homepage.
      </p>
      <Button variant="primary" onClick={handleGoHome}>
        Return to Homepage
      </Button>
    </Container>
  );
}

export default NotFound;
