import { Column } from 'typeorm';

export class Name {
  @Column()
  private firstName: string;
  @Column()
  private secondName: string;

  // protected constructor to prevent direct instantiation
  protected constructor() {}

  // Factory method to create Name instance
  static createName(firstName: string, secondName: string): Name {
    // Optional: Add validation logic here
    if (!firstName || !secondName) {
      throw new Error('Both first name and second name are required');
    }
    const name = new Name();
    name.firstName = firstName;
    name.secondName = secondName;

    return name;
  }

  // Getters
  get getFirstName(): string {
    return this.firstName;
  }

  get getSecondName(): string {
    return this.secondName;
  }
}
