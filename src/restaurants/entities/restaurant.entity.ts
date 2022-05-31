import {Field, ObjectType} from "@nestjs/graphql";

//restaurant를 위한 object type을 보여준다
@ObjectType()
export class Restaurant {

    @Field(is => String)
    name: string

    @Field(type => Boolean)
    isVegan: boolean

    @Field(type => String)
    address: string

    @Field(type => String)
    ownerName: string

}
/* code first 접근 방식을 사용하여 TypeScript 클래스를 사용하여 스키마를 정의하고 
TypeScript 데코레이터를 사용하여 
해당 클래스의 field에 주석을 추가합니다. 

inputType은 object을 통째로 전달해준다 
*/