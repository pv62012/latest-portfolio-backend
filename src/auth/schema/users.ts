import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "../../entities/role.enum";

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ unique: [true, 'Email already exist'] })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: Role.USER })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);