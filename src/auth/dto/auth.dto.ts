import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import { Match } from "../decorators/match.decorator"
import { Transform } from "class-transformer"

export class AuthRegisterDto {

    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value?.trim().toLowerCase())
    email: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8, {
        message: 'Password must contain at least 6 characters'
    })
    password: string

    @IsNotEmpty()
    @IsString()
    @MinLength(8, {
        message: 'Password must contain at least 6 characters'
    })
    @Match('password', {
        message: 'Password do not match'
    })
    passwordConfirm: string
}

export class AuthLoginDto {

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @MinLength(8, {
        message: 'Password must contain at least 6 characters'
    })
    password: string

}