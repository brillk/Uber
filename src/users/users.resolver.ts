import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { User } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor(
        private readonly usersService: UsersService 
    ) {}

    @Query(returns => Boolean)
    hi(){
        return true;
    }

    //첫번째 Mutation
    @Mutation(returns => CreateAccountOutput)
    createAccount(@Args("input") createAccountInput: createAccountInput){}
}