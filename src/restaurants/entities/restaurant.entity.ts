import {Field, InputType, ObjectType} from "@nestjs/graphql";
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Category } from './category.entity';

//restaurant를 위한 object type을 보여준다
@InputType("RestaurantInputType",{isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {

    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field(type => String)
    @Column()
    @IsString()
    coverImage: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;
    
    // category를 지울때 restaurant는 지우면 안된다는 걸 고려해야 한다
    @Field( type => Category, {nullable: true})
    @ManyToOne(
        type => Category, 
        category => category.restaurants,
        { nullable: true, onDelete:"SET NULL"})
    category: Category;

    //restaurant owner
    @Field(type => User)
    @ManyToOne(
        type => User, 
        user => user.restaurants,
        {onDelete: "CASCADE"}
        )
    owner: User;
}
/* 
카테고리는 여러 개의 식당을 가지고, 
식당은 하나의 카테고리를 가진다.
*/