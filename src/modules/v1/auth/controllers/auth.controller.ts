import { Controller, Body, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthFacade } from '../facades/auth.facade';
import { SignInAuthDto } from '../dtos/sign-in.auth.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authFacade: AuthFacade) {}
  
  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  singIn(@Body() singInAuthDto: SignInAuthDto): Promise<any> {
    return this.authFacade.signIn(singInAuthDto);
  }


}
