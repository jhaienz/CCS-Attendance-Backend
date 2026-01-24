import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() data: CreateAuthDto) {
    return this.authService.login(data);
  }

  @Post('signup')
  async signup(@Body() data: CreateAuthDto) {
    return this.authService.signup(data);
  }
}
