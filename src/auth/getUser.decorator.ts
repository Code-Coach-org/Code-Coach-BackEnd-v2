import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken'
import { UsersService } from 'src/user/user.service';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (req.headers['authorization'] === undefined) {
        throw new UnauthorizedException();
    }
    const token = req.headers['authorization'].split(' ')[1];
    try {
        const payload = jwt.verify(token, 'secretToken');
        return payload;
    } catch (err) {
        throw new UnauthorizedException();
    }
})
