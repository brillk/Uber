// 유저 만들기

import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column,Entity, OneToMany } from 'typeorm';
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { Order } from 'src/orders/entities/order.entity';

export enum UserRole {
    Client = "Client",
    Owner = "Owner",
    Delivery = "Delivery",
}


registerEnumType(UserRole, {name: "UserRole"});


@InputType( "UserInputType", {isAbstract: true})
@ObjectType()
@Entity()
export class User extends CoreEntity{
    // 뭐랄까 html의 마크업인가?  @Column = save될때, DB에 지속적으로 있는다.
    @Column({unique: true})
    @Field(type => String)
    @IsEmail()
    email: string;

    @Column({select: false})
    //현재 암호화된 비밀번호가 또 암호화되고 저장된다..이것을 방지하자
    @Field(type => String)
    @IsString()
    password: string;

    @Column({type: "enum", enum: UserRole})
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Column({default: false})
    @Field(type => Boolean)
    @IsBoolean()
    verified: boolean;
    /* Verification을 통해 그 안에 User에 접근해서 
        User의 emailVerified를 false에서 true로 바꿀 것이기 때문에
        Verification쪽에 @JoinColumn()을 추가하고 
      user를 통해 생성한 foreign key인 userId을 추가하도록 한 것이다. */

    @Field(type => [Restaurant])
    @OneToMany(
        type => Restaurant, 
        restaurant => restaurant.owner)
    restaurants: Restaurant[]

    @Field(type => [Order])
    @OneToMany(
        type => Order, 
        order => order.customer)
    orders: Order[];

    @Field(type => [Order])
    @OneToMany(
        type => Order, 
        order => order.driver)
    rides: Order[]

   
    
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        // 만약 users.save()를 전달한 obj에 password 가 존재하면
        // 비밀번호가 hash되서 저장된다
        if(this.password){
            try{
                this.password = await bcrypt.hash(this.password, 10);
                
            }catch(e){
                console.log(e);
                throw new InternalServerErrorException();
            }
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