import { Args, Mutation, Resolver,Query} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { GetOrdersOutput, GetOrdersInput } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './orders.service';


@Resolver(of => Order)
export class OrderResolver {
    constructor(private readonly orderService: OrderService) {}

    @Mutation(returns => CreateOrderOutput)
    @Role(["Client"])
    async createOrder(
        @AuthUser() customer: User, 
        @Args("input")
        createOrderInput: CreateOrderInput)
    : Promise<CreateOrderOutput> {
        return this.orderService.createOrder(customer, createOrderInput);
    }

    // Client, Owner, Delivery = 자신의 '메뉴'를 볼 수 있다
    // 각기 다른 상태지만 전부 각자의 메뉴 상태가 있음
    @Query(returns => GetOrdersOutput)
    @Role(["Any"])
    async getOrders(
        @AuthUser() user: User,
        @Args("input") getOrdersInput: GetOrdersInput,
    ): Promise<GetOrdersOutput> {
        return this.orderService.getOrders(user, getOrdersInput);
    }
}