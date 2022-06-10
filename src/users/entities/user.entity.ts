// 유저 만들기

import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column,Entity } from 'typeorm';
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
    email: string;

    @Column()
    @Field(type => String)
    password: string;

    @Column({type: "enum", enum: UserRole})
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Column({default: false})
    @Field(type => Boolean)
    verified: boolean;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        try{
            this.password = await bcrypt.hash(this.password, 10);
            
        }catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
    /*
        save()메서드를 사용하여 업데이트되기 전에 실행되는 데코레이터이다.
        엔티티에 메소드를 정의하고 @BeforeUpdate() 데코레이터를 사용하면 
        TypeORM이 기존 엔티티를 repository/manager 
        save을 사용하여 업데이트되기 전에 이를 호출합니다. */

    async checkPassword(aPassword: string): Promise<boolean> {
        try{
         const ok = bcrypt.compare(aPassword, this.password); //적은 패스워드와 DB에 있는 값이 같다면
        return ok;
        } catch(e){
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}