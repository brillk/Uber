import {Field, InputType, ObjectType} from "@nestjs/graphql";
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';

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
        { nullable: true, onDelete:"SET NULL"},
    )
    category: Category;

    //restaurant owner
    @Field(type => User)
    @ManyToOne(
        type => User, 
        user => user.restaurants,
        {onDelete: "CASCADE"}
        )
    owner: User;

    /*RelationId 속성에 특정 relation의 id를 로드합니다. 
    예를 들어 Post 엔터티에 Many-to-one이 있는 경우 
    새 속성을 @RelationId로 표시하여 새 Relation ID를 가질 수 있습니다. 
    이 기능은 many-to-many를 포함한 모든 종류의 관계에서 작동합니다.
    Relation ID는 표현용으로만 사용됩니다. 
    값을 연결할 때 기본 relation가 추가/제거/변경되지 않습니다. */
    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;

    @Field(type => [Dish])
    @OneToMany(
        type => Dish,
        dish => dish.restaurant,
    )

    menu: Dish[];
}
// restaurant는 많은 Dish, Dish는 하나의 Restaurant
// restaurant는 menu를 가지고, menu는 Dish의 배열이다
/* 
카테고리는 여러 개의 식당을 가지고, 
식당은 하나의 카테고리를 가진다.
*/