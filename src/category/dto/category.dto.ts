import { IsNotEmpty, IsOptional, IsString } from "class-validator"



export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    image: string
}


export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    image: string
}