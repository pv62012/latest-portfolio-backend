import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, HydratedDocument } from "mongoose";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required:true})
    name: string;

    @Prop({unique: [true, 'Email already exist']})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({default:'USER'})
    role:string;
}

export const UserSchema = SchemaFactory.createForClass(User);