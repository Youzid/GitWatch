import { UserFacade } from './../../user/facades/user.facade';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInAuthDto } from '../dtos/sign-in.auth.dto';
import { Kysely } from 'kysely';
import { DB } from '../../../../infra/database/database.types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthRepository {
    constructor(
        @Inject("DATABASE") private readonly db :Kysely<DB>,
        private jwtService : JwtService,
        private userFacade:UserFacade
    ) { }

   

}
