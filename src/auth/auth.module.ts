import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { jwtConstants, SESSION_TTL_SECONDS } from './constants.js';
import { JwtStrategy } from './jwt.strategy.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

// No controller here - sessions are anonymous queue tickets, so they're
// created where you join the queue (QueueController), not via a
// standalone auth endpoint. This module just provides the signing
// (AuthService + JwtModule) and verification (JwtStrategy + JwtAuthGuard)
// machinery for whoever needs it.
@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: SESSION_TTL_SECONDS },
        }),
    ],
    providers: [AuthService, JwtStrategy, JwtAuthGuard],
    exports: [JwtAuthGuard, AuthService],
})
export class AuthModule {}
