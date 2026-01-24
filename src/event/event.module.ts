import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { AuthModule } from '../guards/jwt.strategy.module';

@Module({
  imports: [AuthModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
