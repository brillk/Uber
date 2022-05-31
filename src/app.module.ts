import { Module } from '@nestjs/common';
import {GraphQLModule} from "@nestjs/graphql";
import { join } from 'path';
import { RestaurantsModule } from './restaurants/restaurants.module';

// 항상 GraphQL을 만들때는 resolvers와 query를 생성해야 한다
@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    RestaurantsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
