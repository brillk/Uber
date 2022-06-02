import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { createRestaurantDto } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

// 항상 GraphQL을 만들때는 resolvers와 query를 생성해야 한다
@Resolver(of => Restaurant)
export class RestaurantResolver {
  //RestaurantService를 여기에 inject해보자
  constructor(private readonly restaurantService: RestaurantService){}
    @Query(returns => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll(); //127.0.01:3000/graphql로 들어가 확인
    }
  
  @Mutation(returns => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: createRestaurantDto): Promise<boolean> { // 주의: async을 쓸때, Promise와 value를 써야함
    try{
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch(e) {
      console.log(e);
      return false;
    }
  }
}