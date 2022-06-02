import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
    constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,) {}

    getAll(): Promise<Restaurant[]>{
        return this.restaurants.find();
    }

    createRestaurant(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
        //create와 save의 차이점 in TypeORM
        // create만 하면 객체만 만들 뿐 DB에 저장하진 않는다. 
        const newRestaurant = this.restaurants.create(createRestaurantDto) //create 리턴 타입이 Restaurant
        return this.restaurants.save(newRestaurant); //save의 리턴 타입이 Promise
    }
    // service와 resolver를 연결하자
    updateRestaurant({id, data}:UpdateRestaurantDto) {
        //restaurant repository에서 update method를 사용하자
        //업뎃하고 싶으면 entity의 field에 보내야 되는데, 그 데이터를 받아야됨
        return this.restaurants.update(id, {...data});
    } // id로 객체를 선택 후, data를 object 형태로 받는다. 
    //하지만 업뎃은 entity가 있던 말던 작동되는지 아닌지 상관하지 않고 업뎃한다
}
//지금 restaurant entity의 respository를 inject하고 있다
// typescript를 이용해 TypeORM의 DB로 접근한 거다