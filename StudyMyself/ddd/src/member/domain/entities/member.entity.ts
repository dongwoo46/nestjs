import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Name } from './name';

@Entity()
export class MemberEntity {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column((type) => Name)
  private name: Name;

  @Column()
  private memberName: string;

  @Column()
  private password: string;

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
