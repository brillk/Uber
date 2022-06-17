import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service'
import got from 'got';
import * as FormData from 'form-data';

jest.mock('got');
jest.mock('form-data');

const TEST_DOMAIN = "test-domain";


describe('MailService', () => {
    let service: MailService;

    beforeEach(async () => {
        const module  = await Test.createTestingModule({
            providers: [MailService, 
                {
                    provide: CONFIG_OPTIONS,
                    useValue: {
                        apiKey: 'test-apiKey',
                        domain: TEST_DOMAIN,
                        fromEmail: 'test-fromEmail',
                },
            }],
        }).compile();
        service = module.get<MailService>(MailService);
    });


    it("should be defined", () => {
        expect(service).toBeDefined();
    })

    
    describe("sendVerificationEmail", () => {
        it("should call sendEmail", () => {
            const sendVerificationEmailArgs = {
                email: 'email',
                code: 'code',
            };

            jest.spyOn(service, 'sendEmail').mockImplementation(async() => true);
            
            service.sendVerificationEmail(
                sendVerificationEmailArgs.email,
                sendVerificationEmailArgs.code,
            );
            //함수를 mock 할수 없을때 spy를 쓴다
            expect(service.sendEmail).toHaveBeenCalledTimes(1);
            expect(service.sendEmail).toHaveBeenCalledWith(
                "Verify Your Email", 
                "verify-email", 
                [
                    { key: 'code', value: sendVerificationEmailArgs.code}, 
                    { key: 'username', value: sendVerificationEmailArgs.email},
                ]);
            })

        })
    describe("sendEmail", () => {
        it("send email", async() => {
            const ok = await service.sendEmail('','', []);
            const formSpy = jest.spyOn(FormData.prototype, "append");
            expect(formSpy).toHaveBeenCalled();
            //spy를 하려면 prototype에 해보자
            expect(got.post).toHaveBeenCalledTimes(1);
            expect(got.post).toHaveBeenCalledWith(
                `https://api.mailgun.net/v3/${TEST_DOMAIN}/messages`, 
                expect.any(Object)
                );
                expect(ok).toEqual(true);
        });

        it("fail on error", async() => {
            jest.spyOn(got, 'post').mockImplementation(() => {
                throw new Error();
            });
            //sendEmail 호출, sendEmail이 got.post를 호출
            //implementation을 mock, error throw
            const ok = await service.sendEmail('','', []);
            expect(ok).toBeFalsy();
        })

        it("send email foreach", async() => {
            const ok = await service.sendEmail('','',[
                {key: 'attr', value:'attrValue'},
            ]);
            console.log(ok);
            const formSpy = jest.spyOn(FormData.prototype, 'append');
            expect(formSpy).toHaveBeenCalledTimes(13);
        })
    });
})