import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/edit-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
    constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
    ) {}

    async getOrCreateCategory(name:string): Promise<Category>{
        const categoryName = name.trim().toLowerCase();
        // slug를 사용해 url이 어떤 것을 의미하는지 보여준다. 빈칸없애고 그안에 - 넣기
        const categorySlug = categoryName.replace(/ /g, '-');
        let category = await this.categories.findOne({slug: categorySlug});
        if(!category) {
            category = await this.categories.save(
                this.categories.create({
                    slug: categorySlug,
                    name: categoryName
                }),
            )
        }
        return category;
    }

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
        ): Promise<CreateRestaurantOutput> {
            try{
                const newRestaurant = this.restaurants.create(createRestaurantInput) //create 리턴 타입이 Restaurant
                newRestaurant.owner  = owner;

                const category = await this.getOrCreateCategory(
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
}

//role base authentication