import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {CreateAccountInput} from "./dtos/create-account.dto";
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>
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
}