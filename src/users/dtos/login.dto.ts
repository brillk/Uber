import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@InputType() // 로그인에 필요한 것 만 반환
export class LoginInput extends PickType(User, ["email", "password"]) {}

@ObjectType()
export class LoginOutput extends CoreOutput {
    //login이 token을 return
    @Field(type => String, {nullable: true})
    token?: string;
}