import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseInterceptors, UseGuards, UploadedFile } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/entities/role.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard(), new RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseInterceptors(FileInterceptor('icon'))
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request, @UploadedFile() icon: Express.Multer.File) {
    return this.categoryService.create(createCategoryDto, (req as any).user, icon);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), new RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseInterceptors(FileInterceptor('icon'))
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto,  @Req() req: Request, @UploadedFile() icon: Express.Multer.File) {
    return this.categoryService.update(id, updateCategoryDto, icon);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(), new RoleGuard([Role.ADMIN, Role.EDITOR]))
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
