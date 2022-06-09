// 유저 만들기

import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column,Entity } from 'typeorm';
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum } from 'class-validator';

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
    @IsEmail()
    email: string

    @Column()
    @Field(type => String)
    password: string

    @Column({type: "enum", enum: UserRole})
    @Field(type => UserRole)
    @IsEnum(UserRole)
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

    async checkPassword(aPassword: string): Promise<boolean> {
        try{
         return bcrypt.compare(aPassword, this.password); //적은 패스워드와 DB에 있는 값이 같다면
        
        } catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}