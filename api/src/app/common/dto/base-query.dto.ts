import { Transform } from 'class-transformer';
import {
    IsIn,
    IsOptional,
    IsString,
    IsNumber,
    IsArray,
    IsObject,
} from 'class-validator';

export class BaseQueryDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    page?: number;


    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc';

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Transform(({ value }) => {
        const filterMap: Record<string, string> = {};
        if (typeof value === 'string') {
            value.split(',').forEach(pair => {
                const [key, val] = pair.split(':');
                if (key && val) filterMap[key] = val;
            });
        }
        return filterMap;
    })
    @IsObject()
    filter?: Record<string, string>;

    @IsOptional()
    @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
    @IsArray()
    @IsString({ each: true })
    tags?: string[];
}