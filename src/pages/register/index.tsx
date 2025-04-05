import { Link } from 'react-router';
import Container from '@shared/components/container';
import Button from '@shared/components/button';
import Input from '@shared/components/input';
import ErrorMessage from '@shared/components/error-message';
import { Routes } from '@shared/constants.ts';
import s from './styles.module.scss';

export function Register() {
  return (
    <div className={s.pageBackground}>
      <Container centerContent className={s.registerContainer}>
        <div className={s.formWrapper}>
          <h1 className={s.title}>Sign Up</h1>
          <p className={s.subtitle}>Create your account to get started</p>

          <form className={s.registerForm}>
            <div className={s.inputGroup}>
              <label htmlFor="name" className={s.label}>
                Name
              </label>
              <Input id="name" type="text" placeholder="Enter your name" />
            </div>

            <div className={s.inputGroup}>
              <label htmlFor="email" className={s.label}>
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                isError // Пример ошибки
              />
              <ErrorMessage message="Email is required" />
            </div>

            <div className={s.inputGroup}>
              <label htmlFor="password" className={s.label}>
                Password
              </label>
              <Input id="password" type="password" placeholder="Enter your password" />
            </div>

            <Button variant="primary" className={s.submitButton}>
              Sign Up
            </Button>
          </form>

          <p className={s.loginLink}>
            Already have an account? <Link to={Routes.LOGIN}>Sign In</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
