import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateSubCatDto {
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly category: string;
    
}