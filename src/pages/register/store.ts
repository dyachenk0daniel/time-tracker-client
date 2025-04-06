import { z } from 'zod';
import createFormStore from '@shared/utils/create-form-store.ts';
import { passwordPattern } from '@entities/user/constants.ts';

export const registerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().regex(passwordPattern, {
    message:
      'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&)',
  }),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

const initialValues: RegisterSchemaType = {
  name: '',
  email: '',
  password: '',
};

export const useRegisterFormStore = createFormStore(initialValues, registerSchema);
