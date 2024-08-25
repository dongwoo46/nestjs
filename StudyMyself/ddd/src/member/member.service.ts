import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberEntity } from './domain/entities/member.entity';
import { Repository } from 'typeorm';
import { Member } from './domain/entities/member';
import { Name } from './domain/entities/name';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}
  async create(createMemberDto: CreateMemberDto) {
    const { memberName, name, password } = createMemberDto;

    const nameVO = Name.createName(name.firstName, name.lastName);
    const member = Member.createMember(memberName, password, nameVO);

    // MemberEntity 객체 생성
    const memberEntity = new MemberEntity();
    memberEntity['memberName'] = memberName;
    memberEntity['password'] = password;
    memberEntity['name'] = nameVO;

    const savedMember = await this.memberRepository.save(memberEntity);

    console.log(savedMember.getMemberName);
    console.log(savedMember.getPassword);

    return savedMember;
    // const savedMember = await this.memberRepository.save(member);
  }

  findAll() {
    return `This action returns all member`;
  }

  findOne(id: number) {
    return `This action returns a #${id} member`;
  }

  update(id: number, updateMemberDto: UpdateMemberDto) {
    return `This action updates a #${id} member`;
  }

  remove(id: number) {
    return `This action removes a #${id} member`;
  }
}
