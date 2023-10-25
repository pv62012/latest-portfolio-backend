import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument, Types } from "mongoose";
import { User } from "src/auth/schema/users";
import { Category } from "src/category/schema/category";
import { Role } from "src/entities/role.enum";
import { SubCategory } from "src/sub-cat/schema/subCategory";

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
    @Prop({ unique: [true, 'title already exist'] })
    title: string;

    @Prop({ required: true })
    shortDescription: string;

    @Prop({ required: true })
    longDescription: string;

    @Prop({type: Types.ObjectId, ref: 'categories',required: true })
    category: Category;

    @Prop({type: Types.ObjectId, ref: 'subcategories',required: true })
    subCategory: SubCategory;
    
    @Prop({type: Object})
    poster: {
        public_id: string ,
        secure_url: string,
    }

    @Prop({ default: Role.EDITOR })
    role: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    authorId: User;

    @Prop({ default: 'PUBLIC' })
    availableFor: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);