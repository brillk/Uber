import { Injectable } from '@nestjs/common';
import { PickType } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User, UserRole } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';


@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItems: Repository<OrderItem>,
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
    ) {}

    /*
    CreateOrderInput에서 받은 각각의 item을 OrderItem으로 만들기
    for...of 명령문은 반복가능한 객체에 대해서 
    반복하고 각 개별 속성값에 대해 실행되는 문이 있는 
    사용자 정의 반복 후크를 호출하는 루프를 생성합니다
    */
    
    async createOrder(
        customer: User, 
        {restaurantId, items}: CreateOrderInput
        ): Promise<CreateOrderOutput> {
            try {
                const restaurant = await this.restaurants.findOne(restaurantId);
                if(!restaurant) {
                    return {
                        ok: false,
                        error: "Restaurant not found",
                    }
                }
                let orderFinalPrice = 0;
                const orderItems: OrderItem[] = [];
                
                for(const item of items) { //forEach 에서는 return 할수 없다 
                    const dish = await this.dishes.findOne(item.dishId);
                    if(!dish){
                        //abort the whole order
                        return {
                            ok: false,
                            error: "Dish not found",
                        }
                    };
                    let dishFinalPrice = dish.price;
    
                    // 모든 extra 가격들을 dish.price에 추가
                    for (const itemOption of item.options) {
                        const dishOption = dish.options.find(
                            dishOption => dishOption.name === itemOption.name)
                        //만약 dishOption에 extra가 없으면, dishOption의 choices를 봐야한다
                        if(dishOption) {
                            if(dishOption.extra) {
                                dishFinalPrice = dishFinalPrice + dishOption.extra;
                            } else {
                                const dishOptionChoice = dishOption.choices.find(
                                    optionChoice => optionChoice.name === itemOption.choice,
                                )
                                if(dishOptionChoice) {
                                    if(dishOptionChoice.extra) {
                                        dishFinalPrice = dishFinalPrice + dishOption.extra;
                                    }
                                }
                            }
                        }
                    }
                    orderFinalPrice = orderFinalPrice + dishFinalPrice;
    
                    //db에서 가져온 dish를 options를 이용해 orderItem을 생성
                    const orderItem = await this.orderItems.save(
                        this.orderItems.create({
                        dish,
                        options: item.options,
                        })
                    );
                    orderItems.push(orderItem);
                }
                
                await this.orders.save(
                    this.orders.create({
                        customer, 
                        restaurant,
                        total: orderFinalPrice,
                        items: orderItems,
                    })
                );
                return {
                    ok: true,

                }
            } catch {
                return {
                    ok: false,
                    error: "Couldn't create order",
                }
            }
        }

    async getOrders(
        user: User, 
        { status }: GetOrdersInput
        ): Promise<GetOrdersOutput> {

            try {
                let orders: Order[];
                if(user.role === UserRole.Client){
                    orders = await this.orders.find({
                        where: {
                            customer: user,
                            ...(status && {status}),
                        }
                    })
                } else if(user.role === UserRole.Delivery){
                    orders = await this.orders.find({
                        where: {
                            driver: user,
                            ...(status && {status}),
                        }
                    })
                } else if(user.role === UserRole.Owner) {
                    const restaurants = await this.restaurants.find({
                        where: {
                            owner: user,
                        },
                        relations: ["orders"],
                    })
                    orders = restaurants.map(restaurant => restaurant.orders).flat(1);
                    // order안에 menu array가 있고, 그걸 하나로 쫙 정렬하게 한다
                    if(status) {
                        orders = orders.filter(order => order.status === status);
                    }
                }
                return {
                    ok: true,
                    orders,
                };
            } catch {
                return {
                    ok: false,
                    error: "Couldn't get orders",
                }
            }
        }

        async getOrder(
            user: User,
            {id: orderId}: GetOrderInput,
        ): Promise<GetOrderOutput> {
            try {
                const order = await this.orders.findOne(orderId,
                    {relations: ['restaurant']});
                // 주문번호찾기
    
                if(!order) {
                    return {
                        ok: false,
                        error: "order not found"
                    };
                }
                let canSee = true;
                if(user.role === UserRole.Client && order.customerId !== user.id) {
                    canSee = false;
                }
                if(user.role === UserRole.Delivery && order.driverId !== user.id) {
                    canSee = false;
                }
                    
                if ( user.role === UserRole.Owner && 
                    order.restaurant.ownerId !== user.id) {
                        canSee = false;
                }

                if(!canSee) {
                    return {
                        ok: false,
                        error: "You can't see that"
                    }
                }
                return {
                    ok: true,
                    order,
                }
            } catch {
                return {
                    ok: false,
                    error: "Couldn't load orders"
                }
            }   
        }
        
}