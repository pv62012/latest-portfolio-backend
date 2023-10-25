import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from '../entities/role.enum';
import { Query as ExpressQuery } from 'express-serve-static-core/index';
import { Types } from 'mongoose';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) { }

  @Post()
  @UseGuards(AuthGuard(), new RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseInterceptors(FileInterceptor('poster'))
  create(@Req() req: Request, @Body() createBlogDto: CreateBlogDto, @UploadedFile() poster: Express.Multer.File) {
    return this.blogsService.create(createBlogDto, (req as any).user, poster);
  }

  @Get()
  findAll(@Query() query: ExpressQuery) {
    return this.blogsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.blogsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), new RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseInterceptors(FileInterceptor('poster'))
  update(@Param('id') id: Types.ObjectId, @Body() updateBlogDto: UpdateBlogDto, @UploadedFile() poster: Express.Multer.File) {
    return this.blogsService.update(id, updateBlogDto, poster);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), new RoleGuard([Role.ADMIN, Role.EDITOR]))
  remove(@Param('id') id: Types.ObjectId) {
    return this.blogsService.remove(id);
  }
}
