import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    /**
     * Inject User Repository
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    /**
     * Inject hashing provider
     */
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null;
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while checking user; ${error}`,
      );
    }

    if (existingUser) {
      throw new BadRequestException(
        'The email address is already in use. Please use a different email',
      );
    }
    // Hash the password
    const hashedPassword = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );

    console.log('hashedPassword', hashedPassword);

    createUserDto.password = hashedPassword;

    let newUser = this.userRepository.create(createUserDto);
    try {
      newUser = await this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while saving user: ${error}`,
      );
    }

    return newUser;
  }
}
