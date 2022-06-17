import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';


const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
  email:  "kim@kim.com",
  password: "12345",
}

//request를 보내니까 메일이 잔뜩 쌓인다
// 이걸 mock으로 해결해보자

jest.mock("got", () => {
  return {
    post: jest.fn(),
  }
})


describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

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
      //GRAPHQL_ENDPOINT로 post request를 보낸다
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        //graphql playground의 형식을 따른다
        query: `
        mutation {
          createAccount(input: {
            email: "${testUser.email}",
            password: "${testUser.password}",
            role: Owner,
          }) {
            ok
            error 
          }
        }`,
      })
      .expect(200)
      .expect(res => {
        const {body: {data:{createAccount}}} = res;
        expect(createAccount.ok).toBe(true);
        expect(createAccount.error).toBe(null);
      })
    })

    it("should fail if account already exist", () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: `
        mutation {
          createAccount(input: {
            email: "${testUser.email}",
            password: "${testUser.password}",
            role: Owner,
          }) {
            ok
            error 
          }
        }`,
      })
      .expect(200)
      .expect(res => {
        const {body: {data: {createAccount}} } = res;
        expect(createAccount.ok).toBe(false);
        expect(createAccount.error).toBe("The User is already Exist");
      });
    })
  })

  describe("login", () => {
    it("should login with correct credentials", () => {
      return request(app.getHttpServer())
        .post(GRAPHQL_ENDPOINT)
        .send({
        query: `
        mutation {
          login(input: {
            email: "${testUser.email}",
            password: "${testUser.password}",
        }) {
            ok
            error 
            token
          }
        }`,
      })
      .expect(200)
      .expect(res => {
        const { body: {data: {login}} } = res;
        expect(login.ok).toBe(true);
        expect(login.error).toBe(null);
        expect(login.token).toEqual(expect.any(String));
        jwtToken = login.token;
      });
    })

    //로그인에 실패했을떄, 상황
    it("should not be able to login with wrong credentials", () => {
      return request(app.getHttpServer())
      .post(GRAPHQL_ENDPOINT)
      .send({
        query: `
        mutation {
          login(input:{
            email:"${testUser.email}",
            password:"xxx",
          }) {
            ok
            error
            token
          }
        }
      `,
      })
      .expect(200)
      .expect(res => {
        const {
          body: {
            data: { login },
          },
        } = res;
        expect(login.ok).toBe(false);
        expect(login.error).toBe('Wrong Password');
        expect(login.token).toBe(null);
      });
    })
  });


  it.todo("userProfile");
  it.todo("me");
  it.todo("verifyEmail");
  it.todo("editProfile");
});
