import { Controller, Post, HttpCode, HttpStatus, UseGuards, Request, Get, Body, Query, Response as NestResponse, } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { Public } from '../decorators/public.decorator';
import { RegisterAuthDto } from '../dtos/register-auth.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Request() req, @NestResponse({ passthrough: true }) res: Response,) {

        const tokens = await this.authService.login(req.user)
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });
        return {
            user: {
                id: req.user.id,
                email: req.user.email,
                username: req.user.username,
            },
            access_token: tokens.access_token,
        };
    }

    // @UseGuards(RefreshAuthGuard)
    // @Post('refresh')
    // async refresh(
    //     @Request() req,
    //     @NestResponse({ passthrough: true }) res: Response,
    // ) {
    //     const { accessToken, refreshToken } =
    //         await this.authService.refreshTokens(
    //             req.user.userId,
    //             req.cookies.refresh_token,
    //         );

    //     res.cookie('refresh_token', refreshToken, {
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: 'strict',
    //         maxAge: 7 * 24 * 60 * 60 * 1000,
    //     });

    //     return {
    //         access_token: accessToken,
    //     };
    // }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Get('verify-email')
    verifyEmail(@Query('token') token: string) {
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
