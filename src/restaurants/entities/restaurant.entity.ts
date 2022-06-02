import {Field, ObjectType} from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//restaurant를 위한 object type을 보여준다
@ObjectType()
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(type => Number)
    id:number;

    @Field(type => String)
    @Column()
    name: string;

    @Field(type => Boolean)
    @Column()
    isVegan: boolean;

    @Field(type => String)
    @Column()
    address: string;

    @Field(type => String)
    @Column()
    ownerName: string;

    @Field(type => String)
    @Column()
    categoryName: string;

}
/* code first 접근 방식을 사용하여 TypeScript 클래스를 사용하여 스키마를 정의하고 
TypeScript 데코레이터를 사용하여 
해당 클래스의 field에 주석을 추가합니다. 

inputType은 object을 통째로 전달해준다 

Entity를 넣음으로서 클래스하나에 GraphQL 스키마와 
DB에 저장되는 실제 데이터의 형식을 만들 수 있다.
*/