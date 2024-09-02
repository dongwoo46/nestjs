export interface CursorPageMetaDtoParameters {
  cursorPageOptionsDto: { take?: number }; // CursorPageOptionsDto의 구조를 간단히 표현
  total: number; // 전체 데이터의 개수
  hasNextData: boolean; // 다음 데이터의 존재 여부
  cursor: number; // 커서 값
}

export class CursorPageMetaDto {
  readonly total: number;
  readonly take: number;
  readonly hasNextData: boolean;
  readonly cursor: number;

  constructor({
    cursorPageOptionsDto,
    total,
    hasNextData,
    cursor,
  }: CursorPageMetaDtoParameters) {
    this.take = cursorPageOptionsDto.take;
    this.total = total;
    this.hasNextData = hasNextData;
    this.cursor = cursor;
  }
}
