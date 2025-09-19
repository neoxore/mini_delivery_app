import { IsDecimal, IsNotEmpty, IsNumber, IsString } from "class-validator"



export class CreateProductDto {

    @IsString()
    name: string

    @IsString()
    description: string
    
    @IsString()
    image: string

    @IsString()
    categoryId: string

    @IsNumber()
    price: number

}

