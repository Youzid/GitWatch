import { Controller,Post, Body, Req, Get, Query, Param} from '@nestjs/common';
import { CreateRepositoryDto } from '../dtos/create-repository.dto';
import { RepositoryService } from '../services/repository.service';

@Controller('repositories')
export class RepositoryController {
  constructor(private readonly repositoryService: RepositoryService) {}

  
  @Post()
  create(@Body() createRepositoryDto: CreateRepositoryDto,@Req() req ) {
    console.log(req.user)
    return this.repositoryService.create(createRepositoryDto,req.user.userId);
  }
  @Get()
  findAll(@Req() req ) {
    return this.repositoryService.findAll(req.user.userId);
  }

  @Get(":id")
  findById(@Param("id") id:number,@Req() req ) {
    return this.repositoryService.findOne(id, req.user.userId);
  }

}
