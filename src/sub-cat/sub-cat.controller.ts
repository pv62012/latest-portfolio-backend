import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Req, Query, UploadedFile } from '@nestjs/common';
import { SubCatService } from './sub-cat.service';
import { CreateSubCatDto } from './dto/create-sub-cat.dto';
import { UpdateSubCatDto } from './dto/update-sub-cat.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/role.guard';
import { Role } from 'src/entities/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { Query as ExpressQuery } from 'express-serve-static-core/index';

@Controller('sub-cat')
export class SubCatController {
  constructor(private readonly subCatService: SubCatService) {}

  @Post()
  @UseGuards(AuthGuard(), new RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseInterceptors(FileInterceptor('icon'))
  create(@Body() createSubCatDto: CreateSubCatDto, @Req() req: Request, @UploadedFile() icon?: Express.Multer.File) {
    return this.subCatService.create(createSubCatDto,  (req as any).user, icon);
  }

  @Get()
  findAll(@Query() query: ExpressQuery) {
    return this.subCatService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCatService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard(), new RoleGuard([Role.ADMIN, Role.EDITOR]))
  @UseInterceptors(FileInterceptor('icon'))
  update(@Param('id') id: string, @Body() updateSubCatDto: UpdateSubCatDto, @UploadedFile() icon?: Express.Multer.File) {
    return this.subCatService.update(id, updateSubCatDto, icon);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subCatService.remove(+id);
  }
}
