import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  //뭔가가 종료되지 않은 상태에서 jest가 종료되었기에 
  // 뜨는 경고 해결
  // 테스트가 끝나면 데이터베이스를 드랍할거다
  afterAll(async() => {
    await getConnection().dropDatabase()
    app.close();
  }) 

  it.todo("createAccount");
  it.todo("userProfile");
  it.todo("login");
  it.todo("me");
  it.todo("verifyEmail");
  it.todo("editProfile");
});
