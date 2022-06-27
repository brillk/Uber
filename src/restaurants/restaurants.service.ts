import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class RestaurantService {
    constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    private readonly categories: CategoryRepository,
    ) {}

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
        ): Promise<CreateRestaurantOutput> {
            try{
                const newRestaurant = this.restaurants.create(createRestaurantInput) //create 리턴 타입이 Restaurant
                newRestaurant.owner  = owner;

                const category = await this.categories.getOrCreate(
                    createRestaurantInput.categoryName,
                );

                newRestaurant.category = category;
                await this.restaurants.save(newRestaurant); //save의 리턴 타입이 Promise
                return {
                    ok:true,
                    
                }
            } catch {
                return {
                    ok: false,
                    error: "Could not create Restaurant"
                }
            }
        } //user가 포함된 restaurant만들기

    async editRestaurant(
        owner: User,
        editRestaurantInput: EditRestaurantInput,
        ): Promise<EditRestaurantOutput> {
            
            try {
                const restaurant  = await this.restaurants.findOne(
                    editRestaurantInput.restaurantId, 
                    {loadRelationIds: true}); // owner와 같은 사람인지 확인
                if(!restaurant) {
                    return {
                        ok: false,
                        error: "Restaurant not found",
                    }
                } 
                if(owner.id !== restaurant.ownerId) {
                    return {
                        ok: false,
                        error: "You can't edit a restaurant that you don't own",
                    }
                }
                let category: Category = null;
                if (editRestaurantInput.categoryName) {
                    category = await this.categories.getOrCreate(
                    editRestaurantInput.categoryName,
                    );
                }
                await this.restaurants.save([ //업뎃을 하려면 배열을 감싸주면 된다
                    {
                    id: editRestaurantInput.restaurantId,
                    ...editRestaurantInput,
                    ...(category && { category }),
                    },
                ]);
                return {
                    ok: true,
                };
            } catch {
                return {
                    ok: false,
                    error: ""
                }
            }
        }

        async deleteRestaurant(
            owner: User, 
            {restaurantId}: DeleteRestaurantInput,
            ): Promise<DeleteRestaurantOutput> {
                try {
                    const restaurant  = await this.restaurants.findOne(
                        restaurantId, 
                        );
                    if(!restaurant) {
                        return {
                            ok: false,
                            error: "Restaurant not found",
                        }
                    } 
                    if(owner.id !== restaurant.ownerId) {
                        return {
                            ok: false,
                            error: "You can't delete a restaurant that you don't own",
                        }
                    }
                    await this.restaurants.delete(restaurantId);
                } catch {
                    return {
                        ok: false,
                        error: "Couldn't delete"
                    }
                }
            }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find();
            return {
                ok: true,
                categories,
            }
        } catch {
            return {
                ok: false,
                error: "Couldn't load categories",
            }
        }
    }

    countRestaurants(category: Category) {
        return this.restaurants.count({ category });
    } 
    // countRestaurant으로 보낸 category에 
    //해당하는 restaurant을 세고 있음

    async findCategoryBySlug({slug, page}: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne(
                {slug},
                //이곳에서 모든 relation을 load하는데 300개정도가 있으면
                // db가 터진다 => pagination을 써서 부분적으로 load하자
                );
            // if you want to load, need to specify what relation to call
            if(!category) {
                return {
                    ok: false,
                    error: "Category not found",
                }
            }
            const restaurants = await this.restaurants.find({
                where: {
                    category, //엔티티를 쿼리할 조건
                },
                take: 25, //로드되는 데이터 갯수 받기
                skip: (page-1) * 25, // page 2로 넘어갈때, page 1에 있던 25개를 스킵
            });
            category.restaurants = restaurants;
            const totalResults = await this.countRestaurants(category);
            return {
                ok: true,
                category,
                totalPages: Math.ceil(totalResults / 25),
            }
        } catch {
            return {
                ok: false,
                error: "Couldn't load category",
            }
        }
    }

    async allRestaurants({ page}: RestaurantsInput,
    ): Promise<RestaurantsOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount(
                /* findAndCount()
                    주어진 기준과 일치하는 모든 엔티티를 카운트하고, 
                    찾아옵니다. */
                { skip: (page-1) * 25, take: 25})
            return {
                ok: true,
                results: restaurants,
                totalPages: Math.ceil(totalResults / 25),
                totalResults,
            }
        } catch {
            return {
                ok: false,
                error: "Couldn't load restaurnats",
            };
        }
    }
}

//role base authentication