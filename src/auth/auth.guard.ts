import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { AllowedRoles } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly reflector: Reflector){}
    canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
        'roles', 
        context.getHandler()
    );
    if(!roles) { // metadata가 없으니 resolver가 public이라는 뜻
        return true;
    }

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user:User = gqlContext["user"];
    if (!user) {
        return false;
    }

    if(roles.includes('Any')) {
        return true;
    }
    
    return roles.includes(user.role);
    }
}
/* Guards
1. 가드는 CanActivate 인터페이스를 구현하는 @Injectable() 데코레이터로 주석이 달린 클래스입니다.
2. 런타임에 존재하는 특정 조건에 따라 주어진 요청이 경로 핸들러에 의해 처리되는지 여부를 결정합니다. 
=> 이것을 흔히 "권한 부여" 라고 합니다
3. 권한 부여는 일반적으로 기존 Express 애플리케이션의 미들웨어에 의해 처리되었습니다.
next() 함수를 호출한 후 어떤 핸들러가 실행될지 모릅니다.
4. Guards는 ExecutionContext 인스턴스에 액세스할 수 있으므로 다음에 실행될 항목을 정확히 알고 있습니다.
토큰을 추출 및 검증하고 추출된 정보를 사용하여 요청을 진행할 수 있는지 여부를 결정합니다. */