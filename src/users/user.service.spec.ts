import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
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

describe("UsersService", () => {

    let service: UsersService;

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
    })

    it("be fine", () => {
        expect(service).toBeDefined();
    });

    //unit 테스트하기
    it.todo('createAccount');
    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
})