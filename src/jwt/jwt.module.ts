import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { JwtService } from './jwt.service';

@Module({})
@Global() 
/*Global modules
즉시 사용할 수 있는 모든 제공자 세트(예: 도우미, 데이터베이스 연결 등)를 제공하려면 @Global() 데코레이터를 사용하여 모듈을 전역적으로 만드십시오.
또는 forRoot안에서 global: true를 통해서도 전역 모듈로 만들 수 있다. */
export class JwtModule {
    static forRoot(options: JwtModuleOptions): DynamicModule {
        return {
            module: JwtModule,
            //module export
            providers: [{
                provide: "JwtService",
                useValue: options,
            },
            JwtService,
        ],
        exports: [JwtService],
        }
    }
}
