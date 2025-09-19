import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";



export class PaginationDto {
    @IsOptional() @IsString()
    cursor?: string;

    @Type(() => Number) 
    @Min(1) @Max(50)
    @IsOptional() @IsInt()
    limit = 20;
}

export class PaginationDtoBase {
    @Type(() => Number) 
    @Min(1)
    @IsOptional() @IsInt()
    page = 1;

    @Type(() => Number) 
    @Min(1) @Max(50)
    @IsOptional() @IsInt()
    limit = 20;
}