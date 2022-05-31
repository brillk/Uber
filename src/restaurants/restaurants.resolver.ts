import { Query, Resolver } from '@nestjs/graphql';

// 항상 GraphQL을 만들때는 resolvers와 query를 생성해야 한다
@Resolver()
export class RestaurantResolver {
  @Query(returns => Boolean)
  isPizzaGood(): Boolean {
    return true;
  }
}