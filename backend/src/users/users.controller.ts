import { Controller, Get, Put, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatGateway } from '../chat/chat.gateway';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private chatGateway: ChatGateway,
  ) {}

  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profileColor: user.profileColor,
    };
  }

  @Put('profile')
  async updateProfile(@Request() req, @Body(ValidationPipe) updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, updateProfileDto);
    
    // Notifier tous les clients connectés du changement de profil
    if (updateProfileDto.profileColor) {
      await this.chatGateway.notifyProfileUpdate(req.user.id, updateProfileDto.profileColor);
    }
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      profileColor: user.profileColor,
    };
  }

  @Get('online')
  async getOnlineUsers() {
    return this.usersService.getOnlineUsers();
  }
} 