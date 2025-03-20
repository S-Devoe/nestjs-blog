import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { AuthService } from './providers/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    /**
     * Inject Auth service
     */
    private readonly authService: AuthService,
    /**
     * Inject Users service
     */
    private readonly usersService: UsersService,
  ) {}

  /**
   * Login user
   * @param email - User email
   * @param password - User password
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
