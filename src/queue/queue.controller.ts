import { Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { AuthService } from '../auth/auth.service.js';
import { SessionTokenResponse } from '../auth/dto/SessionTokenResponse.js';
import { QueueStatusResponse } from './dto/QueueStatusResponse.js';

@Controller('queue')
export class QueueController {
    constructor(private readonly authService: AuthService) {}

    /**
     * Joining the queue is what creates a session - there's no separate
     * sign-up step. No credentials required; the caller gets back a 24h
     * token that must be sent as `Authorization: Bearer <token>` on this
     * and every subsequent queue/purchase request.
     */
    @Post()
    @HttpCode(HttpStatus.OK)
    join(): Promise<SessionTokenResponse> {
        return this.authService.createAnonymousSession();
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getQueueStatus(): QueueStatusResponse {
        return { status: 'Queue is operational' };
    }
}
