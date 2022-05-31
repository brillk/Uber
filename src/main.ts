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
