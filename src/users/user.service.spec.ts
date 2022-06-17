import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

// 지금 가짜로 respo를 만들어서 실험중이다
const mockRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    findOneOrFail: jest.fn(),
    delete: jest.fn(),
});

const mockJwtService = () => ({
    sign: jest.fn(() => 'signed-token-baby'),
    verify: jest.fn(),
})

const mockMailService = () => ({ 
    sendVerificationEmail: jest.fn(),
});
/*
Record
속성 키가 Key이고 속성 값이 Type인 객체 유형을 구성합니다.
이 유틸리티는 유형의 속성을 다른 유형에 매핑하는 데 사용할 수 있습니다.

Keyof Type Operator
keyof 연산자는 객체 type을 사용하여 해당 키의 문자열 또는 숫자 리터럴 통합을 생성합니다.
*/
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe("UsersService", () => {

    let service: UsersService;
    let usersRepository: MockRepository<User>;
    let verificationsRepository: MockRepository<Verification>;
    let mailService: MailService;
    let jwtService: JwtService;

    //테스트 모듈을 만들고 컴파일하기
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UsersService, 
                {
                    provide: getRepositoryToken(User), 
                    useValue: mockRepository(),
                },
                {
                    provide: getRepositoryToken(Verification), 
                    useValue: mockRepository(),
                },
                {
                    provide: JwtService, 
                    useValue: mockJwtService(),
                },
                {
                    provide: MailService, 
                    useValue: mockMailService(),
                }
            ],
            //mocking을 사용해서 테스트하기
        }).compile();
        service = module.get<UsersService>(UsersService);
        mailService = module.get<MailService>(MailService);
        jwtService = module.get<JwtService>(JwtService);
        usersRepository = module.get(getRepositoryToken(User));
        verificationsRepository = module.get(getRepositoryToken(Verification));
    })

    it("be fine", () => {
        expect(service).toBeDefined();
    });

    //unit 테스트하기
    describe('createAccount', () => {

        const createAccountArgs = {
            email: 'bs@email.com',
            password: 'bs.password',
            role: 0,
        };

        it('should fail if user exists', async () => {
            usersRepository.findOne.mockResolvedValue({
            id: 1,
            email: '',
            });
            const result = await service.createAccount(createAccountArgs);
            expect(result).toMatchObject({
                ok: false,
                error: 'The User is already Exist',
                });
            });
        
        it('should create a new user', async () => {
            //함수 자체를 테스트하는 방법도 있다

            // return
            usersRepository.findOne.mockResolvedValue(undefined);
            usersRepository.create.mockReturnValue(createAccountArgs); 
            usersRepository.save.mockResolvedValue(createAccountArgs);

            verificationsRepository.create.mockReturnValue(
                {user: createAccountArgs
            });

            verificationsRepository.save.mockResolvedValue({
                code: 'code'
            });
            

            const result = await service.createAccount(createAccountArgs);
            
            expect(usersRepository.create).toHaveBeenCalledTimes(1);
            expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);  
        
            expect(verificationsRepository.create).toHaveBeenCalledTimes(1);
            expect(verificationsRepository.create).toHaveBeenCalledWith({
                user: createAccountArgs,
            });

            expect(verificationsRepository.save).toHaveBeenCalledTimes(1);
            expect(verificationsRepository.save).toHaveBeenCalledWith({
                user: createAccountArgs,
            });  

            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                expect.any(String), 
                expect.any(String),
            );
            expect(result).toEqual({ok: true});
        });

            // if it's failed this will happen
        it('should fail on exception', async() => {
            usersRepository.findOne.mockRejectedValue(new Error());
                const result= await service.createAccount(createAccountArgs)
            expect(result).toEqual({ok: false, error: "Couldn't create account"});
        });
    });


    describe('login', () => {

        const loginArgument = {
            email: 'bs@email.com',
            password: 'bs.password',
        }
        /*
        mockFn.mockRejectedValue(value)
        항상 거부하는 비동기 mock 함수를 만드는 데 유용합니다.
        */
        it("should be fail if user doesn't exist", async() => {
            usersRepository.findOne.mockResolvedValue(null);

            const result = await service.login(loginArgument);
            
            expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(usersRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object));
        
            expect(result).toEqual({
                ok: false,
                error: "Can't find the User",
            });
        })

        it('should fail if password is wrong',async () => {
            const mockedUser = {
                checkPassword: jest.fn(() => Promise.resolve(false))
                //promise를 리턴하는 mock func이다
            };
            usersRepository.findOne.mockResolvedValue(mockedUser);
            const result = await service.login(loginArgument);
            expect(result).toEqual({ok: false, error: 'Wrong Password'});
        });

        it('should return token if password correct', async() => {
            const mockedUser = {
                id: 1,
                checkPassword: jest.fn(() => Promise.resolve(true)),
            };
            usersRepository.findOne.mockResolvedValue(mockedUser);
            const result = await service.login(loginArgument);
            expect(jwtService.sign).toHaveBeenCalledTimes(1);
            expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Number));
            expect(result).toEqual({ ok: true, token: 'signed-token-baby' });
        });

        it('should fail on exception',async () => {
            usersRepository.findOne.mockRejectedValue(new Error());
            const result = await service.login(loginArgument);
            expect(result).toEqual({ok: false, error: "Can't log user in."})
        })
    });

    //call한 숫자는 앞의 함수를 실행하느라 쌓여서 나온거다 
    //해결법: beforeEach
    //end-to-end testing은 before all을 쓴다
    describe('findById', () => {

        const findByIdArgs = {
            id: 1,
        }

        it('should find an existing user', async() => {
            usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
            const result = await service.findById(1);
            expect(result).toEqual({ok: true, user: findByIdArgs});
        });

        it('should fail if no user is found', async() => {
            usersRepository.findOneOrFail.mockRejectedValue(new Error());
            const result = await service.findById(1);
            expect(result).toEqual({ok: false, error: 'User Not Found'});
        });
    });

    describe('editProfile', () => {

        it("should change email", async() => {
            const oldUser = {
                email: 'bs@old.com',
                verified: true,
            };
            const editProfileArgs = {
                userId: 1,
                input: {email: "bs@new.com"},
            };

            const newVerification = {
                code: 'code',
            }

            const newUser = {
                verified: false,
                email: editProfileArgs.input.email,
            }

            usersRepository.findOne.mockResolvedValue(oldUser);
            verificationsRepository.create.mockReturnValue(newVerification);
            verificationsRepository.save.mockResolvedValue(newVerification);

            await service.editProfile(editProfileArgs.userId, editProfileArgs.input);

            expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
            expect(usersRepository.findOne).toHaveBeenCalledWith(
                editProfileArgs.userId
                );
            // 새로 만든 이메일
            expect(verificationsRepository.create).toHaveBeenCalledWith({
                user: newUser
            });
            expect(verificationsRepository.save).toHaveBeenCalledWith(
                newVerification
            );
                
            //sendVerificationEmail이 new email과 code로 함께 call됨을 expect해야함
            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                newUser.email, 
                newVerification.code);
        })

        it("should change password", async() => {
            const editProfileArgs = {
                userId: 1,
                input: { password: 'newpassword'},
            };
            usersRepository.findOne.mockResolvedValue({ password: 'old' });
            const result = await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
            //newpassword가 call됨
            expect(result).toEqual({ok: true});
        }) 

        it('should fail on exception', async() => {
            usersRepository.findOne.mockRejectedValue(new Error());
            const result = await service.editProfile(1, {email: '12'});
            expect(result).toEqual({ok: false, error: 'Could not update Profile'});
        })
    });


    describe('verifyEmail', () => {
        it("should verify email", async () => {
            const mockedVerification = {
                user: {
                    verified: true,
                },
                id: 1,
            }
            verificationsRepository.findOne.mockResolvedValue(mockedVerification);
        
            const result = await service.verifyEmail('');

            expect(verificationsRepository.findOne).toHaveBeenCalledTimes(1)
            expect(verificationsRepository.findOne).toHaveBeenCalledWith(
                expect.any(Object),
                expect.any(Object),
                );

            expect(usersRepository.save).toHaveBeenCalledTimes(1);
            expect(usersRepository.save).toHaveBeenCalledWith({verified: true});
        
            expect(verificationsRepository.delete).toHaveBeenCalledTimes(1);
            expect(verificationsRepository.delete).toHaveBeenCalledWith(mockedVerification.id);
        
            expect(result).toEqual({ok: true});
        });


        it('should fail on verification not found', async() => {
            verificationsRepository.findOne.mockResolvedValue(undefined);
            const result = await service.verifyEmail('');
            expect(result).toEqual({ok: false, error: 'Verification not found'});
        });

        it('should fail on exception', async() => {
            verificationsRepository.findOne.mockRejectedValue(new Error());
            const result = await service.verifyEmail('');
            expect(result).toEqual({ok: false, error: 'Could not verify Email'});
        });
    });
});