import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as Joi from "joi";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';

// 항상 GraphQL을 만들때는 resolvers와 query를 생성해야 한다
// env파일을 test, production, development로 나눠서 생성
/*
Configuration
응용 프로그램은 종종 다른 환경에서 실행됩니다. 환경에 따라 다른 구성 설정을 사용해야 합니다.
Nest에서 이 기술을 사용하는 좋은 방법은 적절한 .env 파일을 로드하는 ConfigService를 노출하는 ConfigModule을 만드는 것입니다.
npm i @nestjs/config --save // //
*/

/* Joi = JavaScript용 가장 강력한 스키마 설명 언어 및 데이터 유효성 검사기. 
joi는 객체마다 유효성 검사를 한다

token(id)을 유저가 볼수도 있다. 
*/
@Module({
  imports: [
    ConfigModule.forRoot({ //nestJS의 장점: 모듈을 설치하고, 설정가능
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', //production 할때만 env 파일을 무시
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod')
          .required(),
          DB_HOST: Joi.string().required(),
          DB_PORT: Joi.string().required(),
          DB_USERNAME: Joi.string().required(),
          DB_PASSWORD: Joi.string().required(),
          DB_NAME: Joi.string().required(),
          PRIVATE_KEY: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, //string을 number로 바꿔줄때 +를 붙이자
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== "prod",
      logging: process.env.NODE_ENV !== 'prod',
      entities: [User],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({ // dynamic module 설정이 되있다
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({req}) => ({user: req['user']}),
      /*Context
          각 request에 대해 request context를 사용할 수 있습니다. 
          context가 함수로 정의되면 각 request마다 호출되고
          req 속성에 request 객체를 받습니다. */
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    UsersModule, // staic module 어떠한 설정이 되어 있지 않다
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({path: '/graphql', method: RequestMethod.POST});
  }
}
