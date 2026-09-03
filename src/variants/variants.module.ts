import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Variant } from './variant.entity.js';

@Module({
    imports: [TypeOrmModule.forFeature([Variant])],
})
export class VariantsModule {}
