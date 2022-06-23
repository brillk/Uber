import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
    //repository를 로드할때마다 this.categories.find 혹은 getOrCreate를 한다
    async getOrCreate(name:string): Promise<Category>{
        const categoryName = name.trim().toLowerCase();
        // slug를 사용해 url이 어떤 것을 의미하는지 보여준다. 빈칸없애고 그안에 - 넣기
        const categorySlug = categoryName.replace(/ /g, '-');
        let category = await this.findOne({slug: categorySlug});
        if(!category) {
            category = await this.save(
                this.create({
                    slug: categorySlug,
                    name: categoryName
                }),
            )
        }
        return category;
    }
}