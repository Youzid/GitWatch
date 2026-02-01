import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { EventsService } from '../../../../infra/events/events.service';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly eventService: EventsService,
    ) { }

    async getAll() {
        this.eventService.emit("repository.created",{repositoryId:123});
        return await this.userRepository.findAll();        
    }
    async findOneByEmail(email: string): Promise<any> {
        const user = await this.userRepository.findOneByEmail(email);
        return user;
    }

    async create(createUserDto: CreateUserDto) {
        const user = await this.userRepository.create(createUserDto);
        return user;
    }
}
