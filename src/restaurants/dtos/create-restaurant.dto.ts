import {Field, InputType, ArgsType} from '@nestjs/graphql';

// ArgsType - 아래의 정의된 것들을 분리된 argument로써 정의할 수 있다
@ArgsType() 
export class createRestaurantDto {
    @Field(type => String)
     name: string;
    @Field(type => Boolean)
     isVegan: boolean;
    @Field(type => String)
    address: string;
    @Field(type => String)
     ownersName: string;
} 