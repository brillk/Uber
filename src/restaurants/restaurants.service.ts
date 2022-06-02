import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
    constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,) {}

    getAll(): Promise<Restaurant[]>{
        return this.restaurants.find();
    }

    createRestaurant(createRestaurantDto: createRestaurantDto): Promise<Restaurant> {
        //create와 save의 차이점 in TypeORM
        // create만 하면 객체만 만들 뿐 DB에 저장하진 않는다. 
        const newRestaurant = this.restaurants.create(createRestaurantDto) //create 리턴 타입이 Restaurant
        return this.restaurants.save(newRestaurant); //save의 리턴 타입이 Promise
    }
}
//지금 restaurant entity의 respository를 inject하고 있다
// typescript를 이용해 TypeORM의 DB로 접근한 거다