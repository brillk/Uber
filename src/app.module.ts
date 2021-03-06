import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import * as Joi from "joi";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { Verification } from './users/entities/verification.entity';
import { MailModule } from './mail/mail.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Category } from './restaurants/entities/category.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Dish } from './restaurants/entities/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { CommonModule } from './common/common.module';

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
          .valid('dev', 'prod', 'test')
          .required(),
          DB_HOST: Joi.string().required(),
          DB_PORT: Joi.string().required(),
          DB_USERNAME: Joi.string().required(),
          DB_PASSWORD: Joi.string().required(),
          DB_NAME: Joi.string().required(),
          PRIVATE_KEY: Joi.string().required(),
          MAILGUN_API_KEY: Joi.string().required(),
          MAILGUN_DOMAIN_NAME: Joi.string().required(),
          MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT, //string을 number로 바꿔줄때 +를 붙이자
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== "prod",
      logging: 
        process.env.NODE_ENV !== 'prod' && process.env.NODE_ENV !== 'test',
      entities: [User, Verification, Restaurant, Category, Dish, Order, OrderItem],
    }), //새로 entity가 생길때마다 추가
    
    GraphQLModule.forRoot<ApolloDriverConfig>({ // dynamic module 설정이 되있다
      driver: ApolloDriver,
      installSubscriptionHandlers: true, 
      autoSchemaFile: true,
      context: ({req, connection}) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
      /*Context
          각 request에 대해 request context를 사용할 수 있습니다. 
          context가 함수로 정의되면 각 request마다 호출되고
          req 속성에 request 객체를 받습니다. */
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY,
    }),
    MailModule.forRoot({
      apiKey:process.env.MAILGUN_API_KEY,
      domain:process.env.MAILGUN_DOMAIN_NAME,
      fromEmail:process.env.MAILGUN_FROM_EMAIL,
    }),
    AuthModule,
    UsersModule, // staic module 어떠한 설정이 되어 있지 않다
    RestaurantsModule, 
    OrdersModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {}