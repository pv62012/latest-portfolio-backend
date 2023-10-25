import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BlogsModule } from './blogs/blogs.module';
import { CategoryModule } from './category/category.module';
import { SubCatModule } from './sub-cat/sub-cat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.development.env', '.production.env'],
    // envFilePath: '.production.env',
  }),
  MongooseModule.forRoot(process.env.MONGO_URI), 
  AuthModule, 
  BlogsModule, 
  CategoryModule, 
  SubCatModule,
  CloudinaryModule, 
  MulterModule.register({
    dest: './'
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
