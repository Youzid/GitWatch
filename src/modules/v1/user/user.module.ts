import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { DatabaseModule } from "../../../infra/database/database.module";
import { UserRepository } from "./repositories/user.repository";
import { UserFacade } from "./facades/user.facade";
@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService,UserRepository,UserFacade],
    exports:[UserFacade]
})
export class UserModule { }
