import {Field, InputType, ArgsType} from '@nestjs/graphql';
import { IsString, IsBoolean } from 'class-validator';

// ArgsType - 아래의 정의된 것들을 분리된 argument로써 정의할 수 있다
//validator 유효성 검사를 하려면 pipeline을 설치해야 하는 걸 잊지말자
@ArgsType() 
export class createRestaurantDto {

    @Field(type => String)
    @IsString()
    
     name: string;

    @Field(type => Boolean)
    @IsBoolean()
     isVegan: boolean;

    @Field(type => String)
    @IsString()
    address: string;

    @Field(type => String)
    @IsString()
     ownersName: string;
} 