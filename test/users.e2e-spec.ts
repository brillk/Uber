import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';


const GRAPHQL_ENDPOINT = '/graphql';

//request를 보내니까 메일이 잔뜩 쌓인다
// 이걸 mock으로 해결해보자

jest.mock("got", () => {
  return {
    post: jest.fn(),
  }
})


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
    await getConnection().dropDatabase();
    app.close();
  }) 

  describe('createAccount', () => {



    it('should create account', () => {

      const EMAIL = "kim@kim.com";

      //GRAPHQL_ENDPOINT로 post request를 보낸다
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        //graphql playground의 형식을 따른다
        query: `
        mutation {
          createAccount(input: {
            email: "${EMAIL}",
            password: "kim",
            role: Owner,
          }) {
            ok
            error 
          }
        }`,
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.createAccount.ok).toBe(true);
        expect(res.body.data.createAccount.error).toBe(null);
      })
    })

    it("shoyld faile if account already exist", () => {
      const EMAIL = "kim@kim.com";
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: `
        mutation {
          createAccount(input: {
            email: "${EMAIL}",
            password: "kim",
            role: Owner,
          }) {
            ok
            error 
          }
        }`,
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.createAccount.ok).toBe(false);
        expect(res.body.data.createAccount.error).toEqual(expect.any(String));
      })
    })
  })

  it.todo("createAccount");
  it.todo("userProfile");
  it.todo("login");
  it.todo("me");
  it.todo("verifyEmail");
  it.todo("editProfile");
});
