import { registerAs } from '@nestjs/config';

export default registerAs('userConfig', () => ({
  googleProfileApiKey: process.env.GOOGLE_PROFILE_API_KEY || '',
}));
