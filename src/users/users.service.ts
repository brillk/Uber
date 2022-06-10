import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {CreateAccountInput} from "./dtos/create-account.dto";
import { LoginInput } from './dtos/login.dto';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) 
        private readonly verification: Repository<Verification>,
        private readonly jwtService: JwtService,
    ) {}

    async createAccount({
        email, 
        password, 
        role
    }: CreateAccountInput) :Promise<{ok: boolean, error ?: string}>{
        try {
            const exists = await this.users.findOne({email});
            if(exists) {
                //존재하는 계정이기에 에러를 뱉는다
                return {ok: false, error: "The User is already Exist"};
            }
            //계정이 없다면 만든다
            const user = await this.users.save(this.users.create({email, password, role}));
            await this.verification.save(this.verification.create({
                user,
            }))
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
            const token = this.jwtService.sign(user.id);
            // token안에 많은 정보가 아닌 iD정도만 넣어주면 된다
            return {
                ok: true,
                token,
            }
        } catch(error) {
            return {
                ok: false,
                error,
            }
        }
    }
    async findById(id: number): Promise<User> {
        return this.users.findOne({id});
    }
    //로그인하지않으면 edit할수 없으니까, token을 사용해서 업뎃하자,
    async editProfile(userId:number, {email, password}: EditProfileInput): Promise<User> {
        const user = await this.users.findOne(userId);
        if(email) {
            user.email = email;
            user.verified = false;
            await this.verification.save(this.verification.create({user}));
        } 
        /*Verification 엔티티를 생성하고 난 후 user에 위에서 생성한 
            User 엔티티를 넣을 때 주의할 점은 
            await this.userRepository.save(createdUser)를 통해 
            모델을 DB에 완전히 저장한 후 넣어줘야 한다. 
            그렇지 않으면 user에 User데이터가 제대로 들어가지 않고, 
            null값이 들어가게 된다. */

        if(password) {
            user.password = password;
        }
        return this.users.save(user); 
        // If entities do not exist in the database then inserts, otherwise updates.
    }
    async verifyEmail(code:string): Promise<boolean>{
        //verification을 찾고 삭제해준뒤, verified를 true로 만든다
        const verification = await this.verification.findOne({code},{relations: ['user']},);
        if(verification) {
            verification.user.verified = true;
            this.users.save(verification.user);
        }
        return false;
    }
}