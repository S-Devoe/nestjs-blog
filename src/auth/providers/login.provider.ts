import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { LoginDto } from '../dtos/login.dto';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import { CustomDataResponseDto } from 'src/common/data-response/success-response.dto';

@Injectable()
export class LoginProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    /**
     * Inject Hashing provider
     */
    private readonly hashingProvider: HashingProvider,

    /**
     * Inject JWT service
     */
    private readonly jwtService: JwtService,

    /**
     * Inject JWT config
     */
    @Inject(jwtConfig.KEY)
    private readonly configService: ConfigType<typeof jwtConfig>,
  ) {}

  public async login(loginDto: LoginDto) {
    //find the user by email
    const { email, password } = loginDto;

    //call the find user by email provider
    const user = await this.userService.getUserByEmail(email);

    //check if the user exists
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    //compare the password
    let isPasswordValid;

    try {
      isPasswordValid = await this.hashingProvider.comparePassword(
        password,
        user.password,
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error while comparing password: ${error}`,
      );
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid user details');
    }

    //generate the JWT token
    const payload = {
      email: user.email,
      sub: user.id,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.secret,
      expiresIn: this.configService.timeToLive,
    });

    return new CustomDataResponseDto(
      {
        user: user,
        accessToken: accessToken,
      },
      'Login successful',
      HttpStatus.OK,
      true,
    );
  }
}
