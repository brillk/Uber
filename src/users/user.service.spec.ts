import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

// 지금 가짜로 respo를 만들어서 실험중이다
const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
}

const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
}

const mockMailService = {
    sendVerificationEmail: jest.fn(),
}
/*
Record
속성 키가 Key이고 속성 값이 Type인 객체 유형을 구성합니다.
이 유틸리티는 유형의 속성을 다른 유형에 매핑하는 데 사용할 수 있습니다.

Keyof Type Operator
keyof 연산자는 객체 type을 사용하여 해당 키의 문자열 또는 숫자 리터럴 통합을 생성합니다.
*/
type MockRepository<T = any> = Partial<Record<keyof Repository<User>, jest.Mock>>;

describe("UsersService", () => {

    let service: UsersService;
    let usersRepository: MockRepository<User>;
    //테스트 모듈을 만들고 컴파일하기
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [UsersService, 
                {
                provide: getRepositoryToken(User), 
                useValue: mockRepository,
                },
                {
                provide: getRepositoryToken(Verification), 
                useValue: mockRepository,
                },
                {
                provide: JwtService, 
                useValue: mockJwtService,
                },
                {
                provide: MailService, 
                useValue: mockMailService,
                }
        ],
            //mocking을 사용해서 테스트하기
        }).compile();
        service = module.get<UsersService>(UsersService);
        usersRepository = module.get(getRepositoryToken(User));
    })

    it("be fine", () => {
        expect(service).toBeDefined();
    });

    //unit 테스트하기
   describe('createAccount', () => {
    it("should fail if user exists", () => {

    })
   });
    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
})