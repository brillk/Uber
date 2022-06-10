import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/usre-profile.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor( private readonly usersService: UsersService ) {}

    @Query(returns => Boolean)
    hi(){
        return true;
    }


    //첫번째 Mutation
    @Mutation(returns => CreateAccountOutput)
    async createAccount(
        @Args("input") createAccountInput: CreateAccountInput
        ) : Promise<CreateAccountOutput>{
        try {
            const {ok, error} = await this.usersService.createAccount(createAccountInput);
            return {ok, error,};
        } catch(error) {
            return {
                error,
                ok: false,
            }
        }
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            const {ok, error, token} = await this.usersService.login(loginInput);
            return {ok, error, token};
        } catch(error) {
            return {
                ok: false,
                error,
            }
        }
    }

    //@데코레이터 갖다쓰기
    @Query(returns => User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User) {
    return authUser;
    }
    /*@UseGuard() (Binding guards)
    파이프 및 예외 필터와 마찬가지로 가드는 컨트롤러 범위, 
    메서드 범위 또는 전역 범위일 수 있습니다. 
    아래에서 @UseGuards() 데코레이터를 사용하여 컨트롤러 범위 가드를 설정합니다. 
    https://docs.nestjs.com/guards#binding-guards*/

    @UseGuards(AuthGuard)
    @Query(returns => UserProfileOutput)
    async userProfile(@Args() userProfileInput: UserProfileInput
    ): Promise<UserProfileOutput> {
        try {
            const user = await this.usersService.findById(userProfileInput.userId);
            if(!user) {
                throw Error();
            }
            return {
                ok: true,
                user,
            }
        } catch(e) {
            return {
                error: "User Not Found",
                ok: false,
            }
        }
    }

    @UseGuards(AuthGuard)
    @Mutation(returns => EditProfileOutput) 
    async editProfile(@AuthUser() authUser: User, @Args('input') EditProfileInput: EditProfileInput
    ) : Promise<EditProfileOutput> {
        try {
            await this.usersService.editProfile(authUser.id, EditProfileInput);
        } catch (error) {
            return {
                ok: false,
                error,
            }
        }
    }
}