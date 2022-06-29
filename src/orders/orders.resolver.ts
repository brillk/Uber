import { Args, Mutation, Resolver,Query, Subscription} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersOutput, GetOrdersInput } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';

const pubsub = new PubSub();

/*
GraphQL subscriptions은 GraphQL에서 subscriptions을 구현하기 위해 
Redis와 같은 pubsub 시스템과 GraphQL을 연결할 수 있는 간단한 npm 패키지입니다.
모든 GraphQL 클라이언트 및 서버(Apollo뿐만 아니라)와 함께 사용할 수 있습니다.
*/

@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly ordersService: OrderService) {}

    @Mutation(returns => CreateOrderOutput)
    @Role(["Client"])
    async createOrder(
        @AuthUser() customer: User, 
        @Args("input")
        createOrderInput: CreateOrderInput)
    : Promise<CreateOrderOutput> {
        return this.ordersService.createOrder(customer, createOrderInput);
    }

    // Client, Owner, Delivery = 자신의 '메뉴'를 볼 수 있다
    // 각기 다른 상태지만 전부 각자의 메뉴 상태가 있음
    @Query(returns => GetOrdersOutput)
    @Role(["Any"])
    async getOrders(
        @AuthUser() user: User,
        @Args("input") getOrdersInput: GetOrdersInput,
    ): Promise<GetOrdersOutput> {
        return this.ordersService.getOrders(user, getOrdersInput);
    }

    @Query(returns => GetOrderOutput)
    @Role(["Any"])
    async getOrder(
        @AuthUser() user: User,
        @Args("input") getOrderInput: GetOrderInput,
    ): Promise<GetOrderOutput> {
        return this.ordersService.getOrder(user, getOrderInput);
    }

    @Mutation(returns => EditOrderOutput)
    @Role(['Any'])
    async editOrder(
        @AuthUser() user: User, 
        @Args("input") editOrderInput: EditOrderInput
        ): Promise<EditOrderOutput> {
            return this.ordersService.editOrder(user, editOrderInput);
        }
    
    @Subscription(returns => String)
    hot() {
        return pubsub.asyncIterator('hot');
    }
}