import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { JwtService } from './jwt.service'
import * as jwt from "jsonwebtoken";
//mock할 module을 부르는 방법
jest.mock('jsonwebtoken', () => {
    return {
        sign: jest.fn(() => 'TOKEN'),
    }
})


const TEST_KEY = 'testKey';

describe('JwtService', () => {

    let service: JwtService;
    beforeEach(async() => {
        const module = await Test.createTestingModule({
            providers: [JwtService, 
                {
                provide: CONFIG_OPTIONS,
                useValue: {privateKey: TEST_KEY},
            }],
        }).compile();
        service = module.get<JwtService>(JwtService);
    });

    it("should be define", () => {
        expect(service).toBeDefined();
    })

    describe("sign", () => {
        it("should return a signed token", () => {
            const ID = 1;
            const token = service.sign(ID);
            expect(typeof token).toBe('string');
            expect(jwt.sign).toHaveBeenCalledTimes(1);
            expect(jwt.sign).toHaveBeenLastCalledWith({ id: ID }, TEST_KEY);
        })
    })
    describe("verify", () => {
        it("should return the decoded token", () => {
    
        })
    })
});