import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

import * as argon2 from 'argon2';

@Injectable()
export class Argon2Provider implements HashingProvider {
  hashPassword(data: string | Buffer): Promise<string> {
    try {
      const hash = argon2.hash(data.toString());
      return hash;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error hashing password: ' + error,
      );
    }
  }

  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    const isMatch = argon2.verify(encrypted, data.toString());
    return isMatch;
  }
}
