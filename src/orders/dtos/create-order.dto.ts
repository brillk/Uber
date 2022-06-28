import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';;
import { OrderItemOption } from '../entities/order-item.entity';

// 현재 고객이 주문할때 써야하는 정보의 양이 많다
// 그저 새로운 Restaurant id를 받자

@InputType()
class CreateOrderItemInput {
    @Field(type => Int)
    dishId: number;

    @Field(type => [OrderItemOption], {nullable: true})
    options?: OrderItemOption[];
}

@InputType()
export class CreateOrderInput {
    @Field(type => Int)
    restaurantId: number;

    @Field(type => [CreateOrderItemInput])
    items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}