import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repository/category.repository';
import { RestaurantResolver } from "./restaurants.resolver";
import { RestaurantService } from './restaurants.service';


//repository를 생성할때마다 service의 type을 바꿔줘야하고,
// repository를 로드해줘야 한다 inject될 수 있게.
@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])], // respository를 import하기
  providers: [RestaurantResolver, RestaurantService],
})
export class RestaurantsModule {}

/*전체 흐름: AppModule - TypeOrmModule - RestaurantsModule - RestaurantResolver - RestaurantService

1) TypeOrmModule에 DB로 전송할 entity들 설정

2) RestaurantsModule
: TypeOrmModule의 Restaurant 엔티티를 다른 곳에서 Inject할 수 있도록 import하기.
: providers에 RestaurantService 주입 => RestaurantResolver에서 사용 가능.

3) RestaurantService
: @InjectReposity(entity): 전달받은 entity를 기반으로 Repository 생성.
: Repository의 메서드들로 DB에 접근하는 방식 지정.

4) RestaurantResolver
: GraphQL Query/Mutation으로 DB에 접근하는 RestaurantService의 메서드들 활용.
 */