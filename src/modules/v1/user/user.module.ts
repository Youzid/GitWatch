import { Module } from "@nestjs/common";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { DatabaseModule } from "../../../infra/database/database.module";
import { UserDao } from "./daos/user.dao";

@Module({
    imports: [DatabaseModule],
    controllers: [UserController],
    providers: [UserService,UserDao],
})
export class UserModule { }