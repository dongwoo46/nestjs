import { Name } from './name';

export class Member {
  private id: number;
  private memberName: string;
  private password: string;
  private name: Name;

  protected constructor() {}

  static createMember(memberName: string, password: string, name: Name) {
    const member = new Member();
    member.memberName = memberName;
    member.password = password;
    member.name = name;
    return member;
  }

  set setId(id: number) {
    if (this.id) {
      throw new Error('ID is already set');
    }
    this.id = id;
  }

  // Getters
  get getId(): number {
    return this.id;
  }

  get getMemberName(): string {
    return this.memberName;
  }

  get getPassword(): string {
    return this.password;
  }

  get getName(): Name {
    return this.name;
  }
}
