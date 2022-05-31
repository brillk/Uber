import { Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

// 항상 GraphQL을 만들때는 resolvers와 query를 생성해야 한다
@Resolver(of => Restaurant)
export class RestaurantResolver {
  @Query(returns => [Restaurant])
  restaurants(): Restaurant[] {
      restaurants(@Args{'veganOnly'} : Restaurant() {
          
      })
      return [];
  }
}