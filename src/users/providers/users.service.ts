import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GetUsersParamsDto } from '../dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import userConfig from '../config/user.config';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-user.dto';
import { CreateUserProvider } from './create-user.provider';
import { FindUserByEmailProvider } from './find-user-by-email.provider';

/**
 * Class to connect to Users table in the database and perform CRUD operations
 */
@Injectable()
export class UsersService {
  constructor(
    /**
     * Constructor to inject User Repository
     * @param userRepository - User Repository instance
     */
    @InjectRepository(User)
    private userRepository: Repository<User>,

    /**
     * Constructor to inject AuthService
     * @param authService - AuthService instance
     */
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @Inject(userConfig.KEY)
    private readonly userConfiguration: ConfigType<typeof userConfig>,

    /**
     * Inject DataSource
     */
    private readonly dataSource: DataSource,

    /**
     * Create many users provider
     */
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    /**
     *Inject create user provider
     */

    private readonly createUserProvider: CreateUserProvider,

    /**
     * Find user by email provider
     */
    private readonly findUserByEmailProvider: FindUserByEmailProvider,
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
  }

  public async createManyUsers(createUsersDto: CreateManyUsersDto) {
    return await this.usersCreateManyProvider.createManyUsers(createUsersDto);
  }

  /**
   * Method to get users from the database
   * @param getUsersParamsDto - DTO to get users
   * @param limit - Number of users to get
   * @param page - Page number
   * @returns List of users
   */
  public getUsers(
    getUsersParamsDto: GetUsersParamsDto,
    limit: number,
    page: number,
  ) {
    console.log(this.userConfiguration.googleProfileApiKey);
    return [
      {
        id: '1',
        name: 'John Doe',
      },
      {
        id: '2',
        name: 'Jane Doe',
      },
    ];
  }
  /**
   * Method to get user by id
   * @param id
   * @returns
   */

  public async getUserById(id: number) {
    let user: User | null;
    try {
      user = await this.userRepository.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while fetching user: ${error}`,
      );
    }
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  public async getUserByEmail(email: string) {
    return await this.findUserByEmailProvider.findUserByEmail(email);
  }
}
