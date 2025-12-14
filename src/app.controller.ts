import { Controller, Get, } from '@nestjs/common';

@Controller()
export class AppController {

    @Get()
    checkDb() {
        return "hello world"
    }
}