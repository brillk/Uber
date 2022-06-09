import { Inject, Injectable } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from './jwt.constants';

@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions
    ) {} // providers에서 필요한 걸 적고 nestjs에게 요청한다
    hello() {
        console.log("hello");
    }
}
