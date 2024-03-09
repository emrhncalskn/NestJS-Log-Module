import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }


  @Get()
  async getHello() {
    return "Hello from user controller"
  }

  @Post()
  async createUser(@Res() res) {
    throw new Error('Error in user controller')
    return res.status(301).send({ asd: 'asdasdsa' })
  }
}
