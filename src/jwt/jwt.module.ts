import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';

@Module({})
@Global() // 매번 수동으로 적지 않아도 전역으로 구성된다
export class JwtModule {
    static forRoot(): DynamicModule {
        return {
            module: JwtModule,
            //module export
            exports: [JwtService],
            providers: [JwtService],
        }
    }
}
