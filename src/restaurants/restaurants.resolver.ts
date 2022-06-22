import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

// 항상 GraphQL을 만들때는 resolvers와 query를 생성해야 한다
@Resolver(of => Restaurant)
export class RestaurantResolver {
  //RestaurantService를 여기에 inject해보자
  constructor(private readonly restaurantService: RestaurantService){}
  
  @Mutation(returns => CreateRestaurantOutput)
  //metadata => resolver의 추가로 사용할수 있는 data라는 걸 말하고 
  //나중에 그걸 접근할 수 있다
  @Role(["Owner"])
  async createRestaurant(
    @AuthUser() authUser: User, // 로그인된 유저
    @Args('input') createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> { // 주의: async을 쓸때, Promise와 value를 써야함
      return this.restaurantService.createRestaurant(authUser, createRestaurantInput);
  }  // 문제: user를 가지고 있는 restaurant를 생성할수 있다. 처음 생성할때 제외시키자

}