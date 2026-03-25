import { hashPassword, comparePassword } from '../src/services/auth.service';

describe('Auth Service', () => {
  it('should hash and compare passwords correctly', async () => {
    const password = 'mySecretPassword123';
    
    // Hash
    const hashed = await hashPassword(password);
    expect(hashed).toBeDefined();
    expect(hashed).not.toBe(password);

    // Compare Correct
    const isMatch = await comparePassword(password, hashed);
    expect(isMatch).toBe(true);

    // Compare Incorrect
    const isMatchWrong = await comparePassword('wrongpassword', hashed);
    expect(isMatchWrong).toBe(false);
  });
});
