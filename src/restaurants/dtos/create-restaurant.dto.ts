import { InputType, OmitType} from '@nestjs/graphql';
import { Restaurant } from '../entities/restaurant.entity';

// ArgsType - 아래의 정의된 것들을 분리된 argument로써 정의할 수 있다
//validator 유효성 검사를 하려면 pipeline을 설치해야 하는 걸 잊지말자

/* Mapped types 를 이용해서 원하는 객체만 받자*/
@InputType() 
export class createRestaurantDto extends OmitType(Restaurant, ["id"], InputType) {} 
// restaurant에서 id를 제외한 모든걸 받고 싶다 
//  GraphQLError: Input Object type createRestaurantDto must define one or more fields.
// 에러가 나는 이유는 부모(Restaurant)의 타입과 자식(createRestaurantDto)의 타입이 달라서
// => 추가 Input Type
// 