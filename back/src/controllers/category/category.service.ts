import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto } from 'src/models/category/category.dto';
import { CategoryEntity } from 'src/models/category/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  getCategories(page = 1, take = 25): Promise<CategoryEntity[]> {
    return this.categoryRepo.find({
      /* skip: take * (page - 1),
      take, */
      order: {
        id: 'DESC',
      },
      relations: ['articles'],
    });
  }

  getOneCategory(categoryId: number): Promise<CategoryEntity> {
    return this.categoryRepo.findOneOrFail(categoryId, {
      relations: ['articles'],
    });
  }

  async createcCtegory(categoryDto: CategoryDto): Promise<CategoryEntity> {
    const catToCreate: CategoryEntity = { ...categoryDto };
    return this.categoryRepo.save(catToCreate);
  }
}
