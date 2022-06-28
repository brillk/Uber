import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Dish } from 'src/restaurants/entities/dish.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderInput, CreateOrderOutput } from './dtos/create-order.dto';
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
    
    async createOrder(
        customer: User, 
        {restaurantId, items}: CreateOrderInput
        ): Promise<CreateOrderOutput> {
            const restaurant = await this.restaurants.findOne(restaurantId);
            if(!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found",
                }
            }
            // CreateOrderInput에서 받은 각각의 item을 OrderItem으로 만들기
            // for...of 명령문은 반복가능한 객체에 대해서 
            // 반복하고 각 개별 속성값에 대해 실행되는 문이 있는 
            // 사용자 정의 반복 후크를 호출하는 루프를 생성합니다
            for(const item of items) { //forEach 에서는 return 할수 없다 
                const dish = await this.dishes.findOne(item.dishId);
                if(!dish){
                    //abort the whole order
                    return {
                        ok: false,
                        error: "Dish not found",
                    }
                };
                for (const itemOption of item.options) {
                    const dishOption = dish.options.find(
                        dishOption => dishOption.name === itemOption.name)
                    //만약 dishOption에 extra가 없으면, dishOption의 choices를 봐야한다
                    if(dishOption) {
                        if(dishOption.extra) {

                        } else {
                            const dishOptionChoice = dishOption.choices.find(
                                optionChoice => optionChoice.name === itemOption.choice,
                            )
                            if(dishOptionChoice) {
                                if(dishOptionChoice.extra) {

                                }
                            }
                        }
                    }
                }
                //db에서 가져온 dish를 options를 이용해 orderItem을 생성
                // await this.orderItems.save(
                //     this.orderItems.create({
                //     dish,
                //     options: item.options,
                // }));
            }
            
            // const order = await this.orders.save(
            //     this.orders.create({customer, restaurant})
            // );
        }
}