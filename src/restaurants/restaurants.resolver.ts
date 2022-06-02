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
  createRestaurant(
    //사실 원한다면 argument를 많이 만들 순 있다
    // dto로도 만들 수 있다. data transfer object - 대체 가능
    @Args() RestaurantInput: createRestaurantDto
    //Args안의 내용을 없애면 에러가 나지만 바꾸는 방법이 있다
  ): boolean {
    return true;
  }
}