import { IsEmail, IsNotEmpty, isEmail } from "class-validator";

export class CreateAuthDto {
    @IsNotEmpty()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;
}
