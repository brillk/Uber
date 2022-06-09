import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// export class JwtMiddleware implements NestMiddleware {
//     use(req: Request, res: Response, next: NextFunction) {
//       console.log("olo");
//       next();
//     }
// }

//다르게 만들수도 있다
export function JwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers);
  next();
}