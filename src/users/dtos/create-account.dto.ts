// 2개의 DTO 입력과 출력 => create account

import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
    "email", 
    "password", 
    "role",
]) {}

@ObjectType()
export class CreateAccountOutput extends MutationOutput {}


