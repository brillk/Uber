import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

//user를 위한 decorator를 만들었다
export const AuthUser = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const gqlContext = GqlExecutionContext.create(context).getContext();
        const user = gqlContext['user'];
        return user;
    }
)