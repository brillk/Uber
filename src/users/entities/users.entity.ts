// 유저 만들기

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column,Entity } from 'typeorm';

type UserRole = "client" | "owner" | "delivery"

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{
    // 뭐랄까 html의 마크업인가?  @Column = save될때, DB에 지속적으로 있는다.
    @Column()
    @Field(type=>String)
    email: string

    @Column()
    @Field(type=>String)
    password: string

    @Column()
    @Field(type=>String)
    role: UserRole

}