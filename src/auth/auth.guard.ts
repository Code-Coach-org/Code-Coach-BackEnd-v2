import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor() {}
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        if (req.headers['authorization'] === undefined) {
            throw new UnauthorizedException();
        }
        const token = req.headers['authorization'].split(' ')[1];
        try {
            jwt.verify(token, 'secretToken');
            return true;
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}