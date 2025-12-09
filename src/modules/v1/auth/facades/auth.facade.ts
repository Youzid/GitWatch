import { LoggerService } from 'src/infra/logger/logger.service';
import { Injectable } from "@nestjs/common";
import { AuthService } from '../services/auth.service';



@Injectable()
export class AuthFacade {
    constructor(
        private readonly authService: AuthService,
        private readonly logger: LoggerService
    ) { }

    
}


