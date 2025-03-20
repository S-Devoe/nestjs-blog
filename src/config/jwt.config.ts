import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || '',
  timeToLive: process.env.JWT_ACCESS_TOKEN_TTL ?? '1h',
}));
