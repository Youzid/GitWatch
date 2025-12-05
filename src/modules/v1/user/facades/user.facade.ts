import { Injectable } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { LoggerService } from "src/infra/logger/logger.service";

@Injectable()
export class UserFacade {
    constructor(
        private readonly userService: UserService,
        private readonly logger: LoggerService,
    ) {}

    async findUserById(id:number) {
        // this.logger.log('Find User by ID: ' + id)
        return this.userService.getUserById(id)
    }
}