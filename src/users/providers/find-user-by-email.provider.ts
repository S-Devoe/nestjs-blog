import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    /**
     * Constructor to inject User Repository
     * @param userRepository - User Repository instance
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Find user by email
   * @param email - User email
   * @returns User object or null if not found
   */
  public async findUserByEmail(email: string): Promise<User | null> {
    let user: User | null;
    try {
      user = await this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while finding user by email: ${error}`,
      );
    }

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
