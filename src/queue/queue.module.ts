import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { QueueController } from './queue.controller.js';

@Module({
    imports: [AuthModule],
    controllers: [QueueController],
})
export class QueueModule {}
