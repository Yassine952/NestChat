import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto): Promise<User> {
    await this.usersRepository.update(userId, updateProfileDto);
    return this.findById(userId);
  }

  async updateOnlineStatus(userId: number, isOnline: boolean): Promise<void> {
    await this.usersRepository.update(userId, { isOnline });
  }

  async getOnlineUsers(): Promise<User[]> {
    return this.usersRepository.find({
      where: { isOnline: true },
      select: ['id', 'username', 'profileColor', 'isOnline'],
    });
  }

  async setAllUsersOffline(): Promise<void> {
    await this.usersRepository.query('UPDATE users SET isOnline = 0');
  }
} 