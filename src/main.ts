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

/* typescript나 NestJS의 DB와 통신하기 위해선 ORM을 사용할 필요가 있다  

Object Relational mapping(객체 관계 매핑)
*/