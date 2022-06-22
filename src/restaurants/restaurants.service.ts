import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/create-restaurant.dto';
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

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput
        ): Promise<CreateRestaurantOutput> {
            try{
                const newRestaurant = this.restaurants.create(createRestaurantInput) //create 리턴 타입이 Restaurant
                // 조건 1: 저장하기전에 완성시키기
                newRestaurant.owner  = owner;

                // 조건 2: restaurant가 category를 항상 가져야 한다는 조건을 만족시켜준다
                const categoryName = createRestaurantInput.categoryName.trim().toLowerCase();
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
                } // 이름은 다르지만, 같은 카테고리를 공유한다
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
}

//role base authentication