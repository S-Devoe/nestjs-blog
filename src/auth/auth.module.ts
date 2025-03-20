import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { UsersModule } from 'src/users/users.module';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { Argon2Provider } from './providers/argon2.provider';
import { LoginProvider } from './providers/login.provider';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    {
      provide: HashingProvider,
      useClass: Argon2Provider,
    },
    LoginProvider,
  ],
  exports: [AuthService],
  imports: [forwardRef(() => UsersModule), JwtModule],
})
export class AuthModule {}
