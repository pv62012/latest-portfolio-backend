import { Injectable, UploadedFile } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/users';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    private cloudinary: CloudinaryService
  ) { }

  async create(createCategoryDto: CreateCategoryDto, user: User, icon?: Express.Multer.File): Promise<{ message: string }> {

    let iconUploadResult : UploadApiResponse| any;
    if (icon) {
      iconUploadResult = await this.cloudinary.uploadFile(icon, '/category')
    }
    console.log({iconUploadResult});
    
    const category = new this.categoryModel({
      ...createCategoryDto,
      createdBy: user._id,
      icon: iconUploadResult.public_id ? {
        public_id: iconUploadResult.public_id ,
        secure_url: iconUploadResult?.secure_url,
      }: null
    });
    console.log({createCategoryDto});
    
    await category.save();
    return {
      message: "Category Created Successfully"
    };
  }

  async findAll() : Promise<{ data: Category[] }>{
    const allCat = await this.categoryModel.find({})
    return {
      data: allCat
    };
  }

  async findOne(id: string) {
    const categoryData = await this.categoryModel.findById(id);
    return {
      data: categoryData
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, icon: Express.Multer.File) {

    let iconUploadResult : UploadApiResponse| any;
    if (icon) {
      iconUploadResult = await this.cloudinary.uploadFile(icon, '/category')
    }

    const oldData = await this.categoryModel.findById(id);

    console.log({oldData});

    if (oldData?.icon) {
      // delete old icon
     const deleteRes = await this.cloudinary.deleteFile(oldData.icon.public_id)
     console.log(deleteRes, 'deleteRes');
    }
    
    await this.categoryModel.findByIdAndUpdate(id, {
      ...updateCategoryDto,
      icon: iconUploadResult.public_id ? {
        public_id: iconUploadResult.public_id ,
        secure_url: iconUploadResult?.secure_url,
      }: null
    })
    return {
      message:'Category updated successfully'
    };
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
