import { Module } from '@nestjs/common';
import { SubCatService } from './sub-cat.service';
import { SubCatController } from './sub-cat.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from './schema/subCategory';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, CloudinaryModule, MongooseModule.forFeature([{
    name: SubCategory.name,
    schema: SubCategorySchema
  }])],
  controllers: [SubCatController],
  providers: [SubCatService],
})
export class SubCatModule {}
