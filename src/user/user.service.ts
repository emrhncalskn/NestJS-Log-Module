import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserRoles } from 'src/user/enum/user.enum';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(userDto: CreateUserDto) {
    userDto.role_id = UserRoles.USER;
    const user = this.userRepository.create(userDto);
    await this.userRepository.save(user);
    return user;
  }

  async findOneWithEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findwithID(user_id: number) {
    return await this.userRepository.findOne({ where: { id: user_id } });
  }

}
