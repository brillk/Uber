import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
      private readonly jwtService: JwtService,
      private readonly userService: UsersService,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
      if('x-jwt' in req.headers) {
       const token = req.headers['x-jwt'];
       const decoded = this.jwtService.verify(token.toString());
       if(typeof decoded === "object" && decoded.hasOwnProperty('id')) {
         try{
            const user = await this.userService.findById(decoded['id']);
            req['user'] = user; // 애를 공유해보자 http req 같은건데 이걸 graphql resolver에 전달
         } catch (e) {

         }
       }
      }
      next();
    }
}
