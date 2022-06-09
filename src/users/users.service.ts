import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {CreateAccountInput} from "./dtos/create-account.dto";
import { LoginInput } from './dtos/login.dto';
import * as jwt from "jsonwebtoken";
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        private readonly config: ConfigService,
    ) {}

    async createAccount({email, password, role}: CreateAccountInput) :Promise<{ok: boolean, error ?: string}>{
        try {
            const exists = await this.users.findOne({email});
            if(exists) {
                //존재하는 계정이기에 에러를 뱉는다
                return {ok: false, error: "The User is already Exist"};
            }
            //계정이 없다면 만든다
            await this.users.save(this.users.create({email, password, role}));
            return {ok: true};
        } catch(e) {
            return {ok: false, error: "Couldn't create account"}
        }
        //check new user
        // create user & hash the password
        
    }
    async login({
        email, 
        password, 
    }: LoginInput): Promise<{ok: boolean; error?: string; token?: string}> {
        // 1. find the user with the email
        // 2. check if the password is correct
        // 3. make a JWT and give it to the user
        try {
            const user = await this.users.findOne({email});
            if(!user) {
                return {
                    ok: false,
                    error: "Can't find the User",
                }
            }
            const passwordCorrect = await user.checkPassword(password)
            if(!passwordCorrect) {
                return {
                    ok: false,
                    error: "Wrong Password",
                }
            }
            //이제 할일을 지정해주자
            const token = jwt.sign({id: user.id}, this.config.get('SECRET_KEY'));
            // token안에 많은 정보가 아닌 iD정도만 넣어주면 된다
            return {
                ok: true,
                token: "la",
            }
        } catch(e) {
            return {
                ok: false,
                error: "Error Occur",
            }
        }
    }
}