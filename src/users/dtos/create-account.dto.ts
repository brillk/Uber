// 2개의 DTO 입력과 출력 => create account

import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { User } from '../entities/users.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
    "email", 
    "password", 
    "role",
]) {}

@ObjectType()
export class CreateAccountOutput {
    @Field(type => String, {nullable: true})
    error?: string;
    
    @Field(type => Boolean)
    ok: boolean;
}

