import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export class PageOptionsDto {
  @Type(() => String)
  @IsOptional()
  readonly sort?: 'DESC' | 'ASC';

  //@Type(() => String)
  //@IsOptional()
  //readonly s?: string = '';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly take?: number = 9;

  get skip(): number {
    return this.page <= 0 ? (this.page = 0) : (this.page - 1) * this.take;
  }
}
