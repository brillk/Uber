import { Global, Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import got from 'got';
import * as FormData from 'form-data'


//node.js로도 request를 보내줄수 있게 한다 -> got
@Injectable()
@Global()
export class MailService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions
    ) {} 

    //email을 보내는 함수
    private async sendEmail(
        subject:string, 
        template:string, 
        emailVar: EmailVar[],
        ) {

        const form = new FormData();
        form.append("from", `Kim from Nuber-Eats <mailgun@${this.options.domain}>`);
        form.append("to", `stonehead334@gmail.com`);
        form.append("subject", subject);
        form.append("template", template);
        emailVar.forEach(eVar => form.append(`v:${eVar.key}`, eVar.value));

        try {
            await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `api:${this.options.apiKey}`,
                ).toString('base64')}`,
            },
            body:form,
        });
        } catch (error) {
            console.log(error);
        }
    }

    //sendEmail을 호출한다
    sendVerificationEmail(email: string, code: string) {
        this.sendEmail("Verify Your Email", "verify-email", [
            { key: 'code', value: code}, 
            { key: 'username', value: email},
        ]);
    }
}