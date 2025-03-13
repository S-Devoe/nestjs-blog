import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetUsersParamsDto } from './dtos/get-users-params.dto';
import { AuthService } from 'src/auth/providers/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  public getUsers(
    getUsersParamsDto: GetUsersParamsDto,
    limit: number,
    page: number,
  ) {
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
  public getUserById(id: string) {
    return {
      id: id,
      name: 'John Doe',
    };
  }
}
