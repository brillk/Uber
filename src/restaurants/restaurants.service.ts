import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
    constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,) {}

    getAll(): Promise<Restaurant[]>{
        return this.restaurants.find();
    }
}
//지금 restaurant entity의 respository를 inject하고 있다
// typescript를 이용해 TypeORM의 DB로 접근한 거다