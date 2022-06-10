import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserProfileInput {
    @Field(type => Number)
    userId: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
    @Field(type => User, {nullable: true}) // 찾을때도 있고 아닐때도 있어서 nullable
    user?: User;
}