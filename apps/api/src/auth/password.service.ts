import { Injectable } from '@nestjs/common';
import { hash, verify } from '@node-rs/argon2';

// OWASP baseline for Argon2id (the library's default algorithm): m=19 MiB, t=2, p=1.
const OPTIONS = { memoryCost: 19456, timeCost: 2, parallelism: 1 };

/**
 * Stored for accounts an admin created but has not issued a password to yet. It is not a valid
 * Argon2 hash, so no password matches it; verify() treats it like a missing user.
 */
export const UNUSABLE_PASSWORD_HASH = '!unset';

@Injectable()
export class PasswordService {
  /** Used when the user does not exist so login timing does not reveal registered emails. */
  private dummyHash: Promise<string> | undefined;

  hash(password: string): Promise<string> {
    return hash(password, OPTIONS);
  }

  async verify(passwordHash: string | null, password: string): Promise<boolean> {
    if (passwordHash === null || passwordHash === UNUSABLE_PASSWORD_HASH) {
      this.dummyHash ??= this.hash('timing-equalizer-not-a-real-password');
      await verify(await this.dummyHash, password).catch(() => false);
      return false;
    }
    return verify(passwordHash, password).catch(() => false);
  }
}
