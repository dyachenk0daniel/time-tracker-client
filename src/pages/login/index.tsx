import { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { isAxiosError } from 'axios';
import { useLoginMutation } from '@entities/user/hooks';
import Container from '@shared/components/container';
import Button from '@shared/components/button';
import Input from '@shared/components/input';
import ErrorMessage from '@shared/components/error-message';
import { ApiErrorPayload } from '@shared/api/types.ts';
import { ErrorCode } from '@shared/api/error-code.ts';
import { Routes } from '@shared/constants.ts';
import { useNotifications } from '@shared/hooks/use-notifications.ts';
import { useLoginFormStore } from './store.ts';
import s from './styles.module.scss';

export function Login() {
  const { formData, errors, setFieldValue, validateField, validateForm, clearErrors, clearValues, setErrors } =
    useLoginFormStore();
  const loginMutation = useLoginMutation();
  const navigate = useNavigate();
  const { success, error } = useNotifications();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    if (validateForm()) {
      try {
        await loginMutation.mutateAsync(formData);
        success('Successfully signed in!');
        navigate(Routes.HOME);
        clearValues();
      } catch (e) {
        if (!isAxiosError<ApiErrorPayload>(e)) {
          console.error('Non-API Error during login:', e);
          error('An unexpected error occurred. Please check your connection and try again.');
          return;
        }

        const errorCode = e.response?.data.code;
        const serverMessage = e.response?.data.message;

        switch (errorCode) {
          case ErrorCode.USER_NOT_FOUND:
            setErrors({ email: 'No account found with this email address.' });
            break;

          case ErrorCode.INVALID_PASSWORD:
            setErrors({ password: 'Incorrect password. Please try again.' });
            break;

          case ErrorCode.TOO_MANY_ATTEMPTS:
            error('Too many requests, please try again later.');
            break;

          case ErrorCode.INTERNAL_SERVER_ERROR:
            error('An internal server error occurred. Please try again later.');
            break;

          default:
            console.error('API Error during login:', {
              code: errorCode,
              message: serverMessage,
              status: e.response?.status,
            });
            error(serverMessage || 'Login failed. Please check your details or try again later.');
        }
      }
    }
  };

  return (
    <div className={s.pageBackground}>
      <Container centerContent className={s.loginContainer}>
        <div className={s.formWrapper}>
          <h1 className={s.title}>Sign In</h1>
          <p className={s.subtitle}>Welcome back! Please enter your credentials</p>

          <form className={s.loginForm} onSubmit={handleSubmit}>
            <div className={s.inputGroup}>
              <label htmlFor="email" className={s.label}>
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFieldValue('email', e.target.value)}
                onBlur={() => validateField('email')}
                isError={Boolean(errors.email)}
              />
              {errors.email && <ErrorMessage message={errors.email} />}
            </div>

            <div className={s.inputGroup}>
              <label htmlFor="password" className={s.label}>
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFieldValue('password', e.target.value)}
                onBlur={() => validateField('password')}
                isError={Boolean(errors.password)}
              />
              {errors.password && <ErrorMessage message={errors.password} />}
            </div>

            <Button variant="primary" className={s.submitButton} type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <p className={s.registerLink}>
            Don’t have an account? <Link to={Routes.REGISTER}>Sign Up</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
