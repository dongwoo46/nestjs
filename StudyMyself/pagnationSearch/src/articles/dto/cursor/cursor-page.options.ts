import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

export class CursorPageOptionsDto {
  @Type(() => String)
  @IsOptional()
  readonly sort?: 'DESC' | 'ASC' = 'DESC';

  @Type(() => Number)
  @IsOptional()
  readonly take: number = 5;

  @Type(() => Number)
  @IsOptional()
  readonly cursorId?: number = null;

  constructor() {
    this.sort = this.sort ?? 'DESC'; // 기본값 설정
    this.take = this.take ?? 5; // 기본값 설정
    this.cursorId = this.cursorId ?? null; // 기본값 설정
  }
}
