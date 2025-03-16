import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamsDto } from './dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { ConfigType } from '@nestjs/config';
import userConfig from './config/user.config';

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
  ) {}
  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    let newUser = this.userRepository.create(createUserDto);
    newUser = await this.userRepository.save(newUser);

    return newUser;
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
    return await this.userRepository.findOneBy({ id });
  }
}
