import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptProvider implements HashingProvider {
  public async hashPassword(data: string | Buffer): Promise<string> {
    try {
      // Generate a salt
      const salt = await bcrypt.genSalt(10);
      // Hash the password
      const hash = await bcrypt.hash(data.toString(), salt);
      // Return the hash
      return hash;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error hashing password: ' + error,
      );
    }
  }

  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data.toString(), encrypted);
  }
}
