import {v4 as uuidv4} from 'uuid';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Verification extends CoreEntity{

    //One-to-one relations (1:1관계) = A는 하나의 b를 가지고, B도 마찬가지다
    @Column()
    @Field(type => String)
    code: string;

    //User를 삭제할수 없다. -> 혼자 남은 validation을 처리못하기 때문에
    // 이럴때를 validation이 어떻게 행동해야 하는지 길을 알려준다
    @OneToOne(type=> User, {onDelete:"CASCADE"})
    @JoinColumn()
    user: User;

    @BeforeInsert()
    createCode(): void {
        this.code = uuidv4();
    }
   
}