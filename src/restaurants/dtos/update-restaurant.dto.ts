import { InputType, ArgsType, PartialType, Field } from '@nestjs/graphql';
import {CreateRestaurantDto} from './create-restaurant.dto';

@InputType()
class UpdateRestaurantInputType extends PartialType(CreateRestaurantDto) {}

//resolver, mutation에 어떤 restaurant을 수정할건지 알려주기 위해 id를 보내야 함

@InputType()
export class UpdateRestaurantDto {
    @Field(type => Number)
    id: number;

    @Field(type => UpdateRestaurantInputType)
    data: UpdateRestaurantInputType;
}