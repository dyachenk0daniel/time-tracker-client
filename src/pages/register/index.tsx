import { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { isAxiosError } from 'axios';
import { useRegisterMutation } from '@entities/user/hooks';
import Container from '@shared/components/container';
import Button from '@shared/components/button';
import Input from '@shared/components/input';
import ErrorMessage from '@shared/components/error-message';
import { ApiErrorPayload } from '@shared/api/types.ts';
import { ErrorCode } from '@shared/api/error-code.ts';
import { Routes } from '@shared/constants.ts';
import { useRegisterFormStore } from './store.ts';
import { useNotifications } from '@shared/hooks/use-notifications.ts';
import s from './styles.module.scss';

export function Register() {
  const { formData, errors, setFieldValue, validateField, validateForm, clearErrors, clearValues, setErrors } =
    useRegisterFormStore();
  const registerMutation = useRegisterMutation();
  const navigate = useNavigate();
  const { success, error } = useNotifications();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    if (validateForm()) {
      try {
        await registerMutation.mutateAsync(formData);
        success('Successfully registered! Please sign in.');
        navigate(Routes.LOGIN);
        clearValues();
      } catch (e) {
        if (!isAxiosError<ApiErrorPayload>(e)) {
          console.error('Non-API Error during registration:', e);
          error('An unexpected error occurred. Please check your connection and try again.');
          return;
        }

        const errorCode = e.response?.data.code;
        const serverMessage = e.response?.data.message;

        switch (errorCode) {
          case ErrorCode.USER_ALREADY_EXISTS:
            setErrors({ email: 'An account with this email already exists.' });
            break;

          case ErrorCode.TOO_MANY_ATTEMPTS:
            error('Too many requests, please try again later.');
            break;

          case ErrorCode.INTERNAL_SERVER_ERROR:
            error('An internal server error occurred. Please try again later.');
            break;

          default:
            console.error('API Error during registration:', {
              code: errorCode,
              message: serverMessage,
              status: e.response?.status,
            });
            error(serverMessage || 'Registration failed. Please check your details or try again later.');
        }
      }
    }
  };

  return (
    <div className={s.pageBackground}>
      <Container centerContent className={s.registerContainer}>
        <div className={s.formWrapper}>
          <h1 className={s.title}>Sign Up</h1>
          <p className={s.subtitle}>Create your account to get started</p>

          <form className={s.registerForm} onSubmit={handleSubmit}>
            <div className={s.inputGroup}>
              <label htmlFor="name" className={s.label}>
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFieldValue('name', e.target.value)}
                onBlur={() => validateField('name')}
                isError={Boolean(errors.name)}
              />
              {errors.name && <ErrorMessage message={errors.name} />}
            </div>

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

            <Button variant="primary" className={s.submitButton} type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Signing Up...' : 'Sign Up'}
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
