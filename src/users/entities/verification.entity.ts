import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Verification extends CoreEntity{

    //One-to-one relations (1:1관계) = A는 하나의 b를 가지고, B도 마찬가지다
    @Column()
    @Field(type => String)
    code: string;

    @OneToOne(type=> User)
    @JoinColumn()
    user: User;
}