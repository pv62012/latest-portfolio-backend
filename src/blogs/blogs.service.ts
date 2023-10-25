import { Catch, ConflictException, HttpException, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel, Schema } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './schema/blogs';
import mongoose, { Document, Model, Types, isObjectIdOrHexString } from 'mongoose';
import { Query } from 'express-serve-static-core/index';
import { User } from 'src/auth/schema/users';
import { IBlogDetails } from './dto/get-blog.dto';
import { UploadApiResponse } from 'cloudinary';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private readonly blogModel: Model<BlogDocument>,
    private cloudinary: CloudinaryService
  ) { }

  async create(createBlogDto: CreateBlogDto, user: User, poster: Express.Multer.File): Promise<{ message: string }> {
    try {

      let posterUploadResult: UploadApiResponse | any;
      if (poster) {
        posterUploadResult = await this.cloudinary.uploadFile(poster, '/blogs')
      }

      const newBlog = new this.blogModel({
        ...createBlogDto,
        category: new Types.ObjectId(createBlogDto.category),
        subCategory: new Types.ObjectId(createBlogDto.subCategory),
        authorId: user._id,
        poster: posterUploadResult.public_id ? {
          public_id: posterUploadResult.public_id,
          secure_url: posterUploadResult?.secure_url,
        } : null
      });
      await newBlog.save();
      return { message: 'New blog added successfully' };
    } catch (error) {
      if (error.code === 11000) { // MongoDB duplicate key error code
        throw new ConflictException('Blog with the same title already exists');
      }
      throw error; // Re-throw other errors
    }
  }

  async findAll(query: Query): Promise<Blog[]> {
    const limit = Number(query.limit);
    const offset = query.page && limit ? (Number(query.page) - 1) * limit : 0

    const searchQuery = query.keyword ? {
      title: {
        $regex: query.keyword,
        $options: 'i'
      }
    } : {}


    const blogs = this.blogModel.aggregate([
      {
        $match: {
          ...searchQuery
        }
      },
      {
        $lookup:
        {
          from: "categories",
          let: {
            category: "$category",
            subCategory: "$subCategory"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$category"] // Match documents where the _id equals the categoryId variable
                }
              },
            },
          ],
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategoryDetails'
        }
      },
      {
        $unwind: {
          path: "$subCategoryDetails",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $sort: {
          createdAt: -1
        }
      },
      ...(offset ? [
        { $skip: offset }
      ] : []),
      ...(limit ? [{
        $limit: limit
      }] : []),
    ])

    return blogs;
  }

  async findOne(id: Types.ObjectId): Promise<IBlogDetails | []> {
    console.log(id);

    const blogDetails: IBlogDetails[] = await this.blogModel.aggregate([
      {
        $match:
        {
          _id: new Types.ObjectId(id),
        },
      },
      {
        $lookup:
        {
          from: "categories",
          let: {
            category: "$category",
            subCategory: "$subCategory"
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$category"] // Match documents where the _id equals the categoryId variable
                }
              },
            },
          ],
          as: "categoryDetails",
        },
      },
      {
        $unwind: {
          path: "$categoryDetails",
          preserveNullAndEmptyArrays: false
        }
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: 'subCategory',
          foreignField: '_id',
          as: 'subCategoryDetails'
        }
      },
      {
        $unwind: {
          path: "$subCategoryDetails",
          preserveNullAndEmptyArrays: false
        }
      }
    ]);
    console.log(blogDetails, 'blogDetails');

    return blogDetails?.length ? blogDetails[0] : [];
  }

  async update(id: Types.ObjectId, updateBlogDto: UpdateBlogDto, poster: Express.Multer.File): Promise<{ message: string }> {

    let posterUploadResult: UploadApiResponse | any;
    if (poster) {
      posterUploadResult = await this.cloudinary.uploadFile(poster, '/blogs')
    }

    const oldData = await this.blogModel.findById(id);

    console.log({ oldData });

    if (oldData?.poster) {
      // delete old icon
      const deleteRes = await this.cloudinary.deleteFile(oldData.poster.public_id)
      console.log(deleteRes, 'deleteRes');
    }
    await this.blogModel.findByIdAndUpdate(id, {
      ...updateBlogDto,
      poster: posterUploadResult.public_id ? {
        public_id: posterUploadResult.public_id,
        secure_url: posterUploadResult?.secure_url,
      } : null
    });
    return {
      message: 'blog updated successfully'
    };
  }

  async remove(_id: Types.ObjectId): Promise<{ message: string }> {
    await this.blogModel.deleteOne({ _id });
    return { message: `blog deleted successfully` };
  }
}
