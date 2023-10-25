import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Types } from "mongoose";

export class CreateBlogDto {
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(160)
    @IsString()
    readonly shortDescription: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(200)
    readonly longDescription: string;

    @IsNotEmpty()
    readonly category: Types.ObjectId;

    @IsNotEmpty()
    readonly subCategory: Types.ObjectId;
}
