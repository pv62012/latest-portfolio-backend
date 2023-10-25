import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCatDto } from './create-sub-cat.dto';

export class UpdateSubCatDto extends PartialType(CreateSubCatDto) {}
