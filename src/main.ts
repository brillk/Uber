import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
/* AppModule은 main.ts로 import 되는 유일한 모듈이다 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //pipelines
  app.use(JwtMiddleware); // 아예 이렇게 서버에 그냥 미들웨어나 넣자 
  await app.listen(3000);
}
bootstrap();

/* typescript나 NestJS의 DB와 통신하기 위해선 ORM을 사용할 필요가 있다  

Object Relational mapping(객체 관계 매핑)


Entity는 DB에 저장되는 데이터의 형태를 보여주는 모델
그리고 TypeORM이 DB에 저장하게 해준다
*/