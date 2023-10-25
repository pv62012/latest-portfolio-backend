import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "src/auth/schema/users";
import { Role } from "src/entities/role.enum";

export type SubCategoryDocument = SubCategory & Document;

@Schema({ timestamps: true })
export class SubCategory {
    @Prop({ unique: [true, 'title already exist'] })
    title: string;

    @Prop({type: Object})
    icon: {
        public_id: string ,
        secure_url: string,
    }

    @Prop({type: Types.ObjectId, ref: 'Category', required: true})
    category: string

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy: User;
}

export const SubCategorySchema = SchemaFactory.createForClass(SubCategory);