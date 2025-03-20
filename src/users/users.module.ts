import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersCreateManyProvider } from './providers/users-create-many.provider';
import userConfig from './config/user.config';
import { Argon2Provider } from 'src/auth/providers/argon2.provider';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { CreateUserProvider } from './providers/create-user.provider';
import { FindUserByEmailProvider } from './providers/find-user-by-email.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersCreateManyProvider,
    {
      provide: HashingProvider,
      useClass: Argon2Provider,
    },
    CreateUserProvider,
    FindUserByEmailProvider,
  ],
  exports: [UsersService, FindUserByEmailProvider],
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User]),
    ConfigModule.forFeature(userConfig),
  ],
})
export class UsersModule {}
