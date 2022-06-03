// 유저 만들기

import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column,Entity } from 'typeorm';
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from '@nestjs/common';

enum UserRole {
    Client,
    Owner,
    Delivery,
}

registerEnumType(UserRole, {name: "UserRole"});

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{
    // 뭐랄까 html의 마크업인가?  @Column = save될때, DB에 지속적으로 있는다.
    @Column()
    @Field(type => String)
    email: string

    @Column()
    @Field(type => String)
    password: string

    @Column({type: "enum", enum: UserRole})
    @Field(type => UserRole)
    role: UserRole

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        try{
            this.password = await bcrypt.hash(this.password, 10);
            
        }catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}