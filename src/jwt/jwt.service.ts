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
}
