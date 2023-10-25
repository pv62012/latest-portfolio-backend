import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './schema/blogs';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, CloudinaryModule, MongooseModule.forFeature([{
    name: Blog.name,
    schema: BlogSchema
  }])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule { }
