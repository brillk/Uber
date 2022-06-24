import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
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

}

//role base authentication