import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [],
    controllers: []
})

export class OrdersModule {}
