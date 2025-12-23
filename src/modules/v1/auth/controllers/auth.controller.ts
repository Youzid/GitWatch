import { Controller, Post, HttpCode, HttpStatus, UseGuards, Request, Get, Body, Query } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { RegisterAuthDto } from '../dtos/register-auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    
    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@Request() req) {
        return this.authService.login(req.user);
    }
    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('verify-email')
    verifyEmail(@Query('token') token:string) {
        return this.authService.verifyEmail(token);
    }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('register')
    register(@Body() registerDto: RegisterAuthDto) {
        return this.authService.register(registerDto);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}
