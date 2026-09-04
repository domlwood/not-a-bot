import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import { SESSION_TTL_SECONDS } from './constants.js';
import { SessionTokenResponse } from './dto/SessionTokenResponse.js';
import { SessionPayload } from './session-payload.interface.js';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    /**
     * Issues a signed, short-lived (24h) queue session token. No
     * credentials are required - anyone can request one - it just gives
     * the holder a verifiable ticket for the duration of their visit
     * (queueing, bot scoring, etc). There's no such thing as a logged-in
     * user here, so every session is anonymous. The 24h expiry comes
     * from AuthModule's JwtModule.register signOptions.
     */
    async createAnonymousSession(): Promise<SessionTokenResponse> {
        const payload: SessionPayload = { sub: randomUUID() };
        const accessToken = await this.jwtService.signAsync(payload);

        return { accessToken, expiresIn: SESSION_TTL_SECONDS };
    }
}
