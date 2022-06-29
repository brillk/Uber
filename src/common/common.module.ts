import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from './common.constants';

// pubsub은 전체에서 하나만 써야됨
/*
pubsub은 별도로 분리된 서버이다 
따라서 여러 개의 서버를 쓰고 있을때, 
효과가 좋지 못하다 따로 서버를 또 만들어야 하기때문에

밑처럼 redis를 사용해서 pubsub을 사용할 수 있다
graphql-redis-subscriptions

https://github.com/davidyaha/graphql-redis-subscriptions
*/
@Global()
@Module({
    providers: [{
        provide: PUB_SUB,
        useValue: new PubSub(),
        }
    ],
    exports: [PUB_SUB],
})
export class CommonModule {}
