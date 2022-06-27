import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Category } from './category.entity';
import { Restaurant } from './restaurant.entity';


// 현재 어떤 옵션으로 

@InputType( "DishOptionInputType", {isAbstract: true} )
@ObjectType()
class DishOption {

    @Field(type => String)
    name: string;
    @Field(type => [String])
    choices: string[];
    @Field(type => Int, {nullable: true})
    extra?: number;
}

@InputType( "DishInputType", {isAbstract: true} )
@ObjectType()
@Entity()
export class Dish extends CoreEntity {

    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field(type => Int)
    @Column()
    @IsNumber()
    price: number;  
    
    @Field(type => String, {nullable: true})
    @Column({nullable: true})
    @IsString()
    photo: string;

    @Field(type => String)
    @Column()
    @Length(5, 120)
    description: string;

    @Field( type => Restaurant)
    @ManyToOne(
        type => Restaurant, 
        restaurant => restaurant.menu,
        {onDelete:"CASCADE"}
    )
    restaurant: Restaurant;

    //부분을 로드한다 만약 id만을 원할때
    @RelationId((dish: Dish) => dish.restaurant)
    restaurantId: number;


    //dish는 다른 데이터 타입으로 저장
    @Field(type => [DishOption])
    @Column({type: "json"})
    options: DishOption[]
}