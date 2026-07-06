import { describe, it, expect } from 'vitest';
import { isAdministrative } from './auth';
import { UserRole } from '../types';

describe('isAdministrative', () => {
  it('should return true for ADMIN role', () => {
    const user = { roles: [UserRole.ADMIN] };
    expect(isAdministrative(user as any)).toBe(true);
  });

  it('should return true for MANAGER role', () => {
    const user = { roles: [UserRole.MANAGER] };
    expect(isAdministrative(user as any)).toBe(true);
  });

  it('should return true for ACCOUNTANT role', () => {
    const user = { roles: [UserRole.ACCOUNTANT] };
    expect(isAdministrative(user as any)).toBe(true);
  });

  it('should return false for PROFESSIONAL role', () => {
    const user = { roles: [UserRole.PROFESSIONAL] };
    expect(isAdministrative(user as any)).toBe(false);
  });

  it('should return false for SECRETARY role', () => {
    const user = { roles: [UserRole.SECRETARY] };
    expect(isAdministrative(user as any)).toBe(false);
  });

  it('should return false if user has no roles', () => {
    const user = { roles: [] };
    expect(isAdministrative(user as any)).toBe(false);
  });

  it('should return false if user is null', () => {
    expect(isAdministrative(null)).toBe(false);
  });

  it('should return true if user has multiple roles including ADMIN', () => {
    const user = { roles: [UserRole.PROFESSIONAL, UserRole.ADMIN] };
    expect(isAdministrative(user as any)).toBe(true);
  });
});
