import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
/* AppModule은 main.ts로 import 되는 유일한 모듈이다 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //pipelines 
  await app.listen(3000);
}
bootstrap();

// middleware를 어디서든지 쓰고 싶다면 functional middleware이어야 하고,
// class middleware를 사용하려면 app.module에서 해야한다

/* typescript나 NestJS의 DB와 통신하기 위해선 ORM을 사용할 필요가 있다  

Object Relational mapping(객체 관계 매핑)


Entity는 DB에 저장되는 데이터의 형태를 보여주는 모델
그리고 TypeORM이 DB에 저장하게 해준다
*/