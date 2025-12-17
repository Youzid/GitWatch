import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { DatabaseModule } from "../../../infra/database/database.module";
import { UserRepository } from "./repositories/user.repository";
import { UserFacade } from "./facades/user.facade";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "../auth/guards/jwt-auth.guard";

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService,UserRepository,UserFacade ,{provide:APP_GUARD, useClass:AuthGuard}],
    exports:[UserFacade]
})
export class UserModule { }