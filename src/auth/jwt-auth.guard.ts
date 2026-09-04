import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Delegates entirely to Passport's 'jwt' strategy (JwtStrategy). It
// extracts the Bearer token, verifies the signature and 24h expiry, and
// throws UnauthorizedException on failure - attaching the payload to
// `request.user` on success.
//
// The explicit empty constructor matters: without it, this subclass has
// no constructor of its own, so its (inherited) design:paramtypes only
// resolves correctly under some TS/decorator-metadata setups. Declaring
// it - even empty - pins this class's constructor to "no dependencies".
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor() {
        super();
    }
}
