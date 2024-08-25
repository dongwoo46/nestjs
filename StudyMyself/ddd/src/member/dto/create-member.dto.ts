import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class NameDto {
  firstName: string;
  lastName: string;
}

export class CreateMemberDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @IsString()
  @IsNotEmpty()
  memberName: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
