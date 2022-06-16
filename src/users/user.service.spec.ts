import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';

describe("UsersService", () => {

    let service: UsersService;

    //테스트 모듈을 만들고 컴파일하기
    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [UsersService],
        }).compile();
        service = module.get<UsersService>(UsersService);
    })

    it("be fine", () => {
        expect(service).toBeDefined();
    });
    
    // 테스트하기
    it.todo('createAccount');
    it.todo('login');
    it.todo('findById');
    it.todo('editProfile');
    it.todo('verifyEmail');
})