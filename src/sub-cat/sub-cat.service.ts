import { Injectable } from '@nestjs/common';
import { CreateSubCatDto } from './dto/create-sub-cat.dto';
import { UpdateSubCatDto } from './dto/update-sub-cat.dto';
import { User } from 'src/auth/schema/users';
import { InjectModel } from '@nestjs/mongoose';
import { SubCategory, SubCategoryDocument } from './schema/subCategory';
import { Model } from 'mongoose';
import { Query } from 'express-serve-static-core/index';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class SubCatService {
  constructor(
    @InjectModel(SubCategory.name)
    private readonly subCategoryModel: Model<SubCategoryDocument>,
    private cloudinary: CloudinaryService
  ) { }

  async create(createSubCatDto: CreateSubCatDto, user: User, icon?: Express.Multer.File): Promise<{ message: string }> {
    let iconUploadResult : UploadApiResponse| any;
    if (icon) {
      iconUploadResult = await this.cloudinary.uploadFile(icon, '/subcategory')
    }

    console.log({iconUploadResult, icon});
    
    const category = new this.subCategoryModel({
      ...createSubCatDto,
      createdBy: user._id,
      icon: iconUploadResult.public_id ? {
        public_id: iconUploadResult.public_id ,
        secure_url: iconUploadResult?.secure_url,
      }: null
    });
    await category.save();
    return {
      message: "SubCategory Created Successfully"
    };
  }

  async findAll(query: Query) : Promise<{ data: SubCategory[] }> {
    const findQuery = {
      category: query?.category
    }
    const SubCat = await this.subCategoryModel.find(query?.category ? findQuery : {})
    console.log(SubCat);
    
    return {
      data: SubCat
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} subCat`;
  }

  async update(id: string, updateSubCatDto: UpdateSubCatDto,  icon?: Express.Multer.File) {

    let iconUploadResult : UploadApiResponse| any;
    if (icon) {
      iconUploadResult = await this.cloudinary.uploadFile(icon, '/subcategory')
    }

    const oldData = await this.subCategoryModel.findById(id);

    // delete old icon
    if (oldData?.icon) {
     await this.cloudinary.deleteFile(oldData.icon.public_id);
    }
    
    await this.subCategoryModel.findByIdAndUpdate(id, {
      ...updateSubCatDto,
      icon: iconUploadResult.public_id ? {
        public_id: iconUploadResult.public_id ,
        secure_url: iconUploadResult?.secure_url,
      }: null
    })
    return {
      message:'SubCategory updated successfully'
    };;
  }

  async remove(id: number) {
    return `This action removes a #${id} subCat`;
  }
}
