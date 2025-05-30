import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async createMessage(userId: number, sendMessageDto: SendMessageDto): Promise<Message> {
    const message = this.messagesRepository.create({
      content: sendMessageDto.content,
      userId,
    });
    return this.messagesRepository.save(message);
  }

  async getRecentMessages(limit: number = 50): Promise<Message[]> {
    return this.messagesRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getMessageWithUser(messageId: number): Promise<Message> {
    return this.messagesRepository.findOne({
      where: { id: messageId },
      relations: ['user'],
    });
  }
} 