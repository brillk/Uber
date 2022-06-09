import { Inject, Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';

@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions
    ) {} // providers에서 필요한 걸 적고 nestjs에게 요청한다
    sign(userId: number): string {
        return jwt.sign({id:userId}, this.options.privateKey);
    }
    // 확인 검사
    verify(token: string) {
        return jwt.verify(token, this.options.privateKey);
    }
    
/*현재 여기서 JwtMiddleware가 하는 역할
1. request headers안에 token을 가져온다.
2. 가져온 token을 jwt.verify()를 이용해서 토큰을 검증하고 payload를 반환한다.
3. 반환한 payload를 이용해서 유저를 찾는다.
4. 유저를 찾았다면 찾은 유저의 정보를 req에 다시 넣어 다음 미들웨어에 전달한다. */
}
