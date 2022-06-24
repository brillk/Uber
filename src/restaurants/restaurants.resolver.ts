import { Parent, Query } from '@nestjs/graphql';
import { Resolver, Args, Mutation, ResolveField, Int } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { Category } from './entities/category.entity';
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
      return this.restaurantService.createRestaurant(
        authUser, 
        createRestaurantInput);
  }  // 문제: user를 가지고 있는 restaurant를 생성할수 있다. 처음 생성할때 제외시키자

  @Mutation(returns => EditRestaurantOutput)
  @Role(["Owner"])
  editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput:EditRestaurantInput
  ) : Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation(returns => DeleteRestaurantOutput)
  @Role(["Owner"])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(
      owner, 
      deleteRestaurantInput);
  }

}


@Resolver(of => Category) //2개만 만든다 
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField(type => Int) 
  // 매 request마다 계산된 field를 보여준다
  //DB에는 존재하지 않고 GraphQL 스키마에만 존재)
  restaurantCount(@Parent() category: Category): Promise<number> {
    //카테고리가 몇개나 있는지 센다
    return this.restaurantService.countRestaurants(category);
  }

  
  @Query(type => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }

  @Query(type=>CategoryOutput)
  category(@Args() categoryInput: CategoryInput): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}