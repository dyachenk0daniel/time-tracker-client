export class RegistrationError extends Error {
  constructor(message: string) {
    super(`Registration failed: ${message}`);
    this.name = 'RegistrationError';
  }
}
