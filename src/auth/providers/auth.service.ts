import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { LoginDto } from '../dtos/login.dto';
import { LoginProvider } from './login.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject Users service
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,

    /**
     * Inject Login provider
     */
    private readonly loginProvider: LoginProvider,
  ) {}
  public async login(loginDto: LoginDto) {
    return await this.loginProvider.login(loginDto);
  }
}
