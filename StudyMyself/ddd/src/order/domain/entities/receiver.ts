import { Getter } from 'src/decorators/getter.decorator';

// receiver.ts
@Getter()
export class Receiver {
  private name: string;
  private phoneNumber: string;

  // protected constructor to prevent direct instantiation
  protected constructor() {}

  // Factory method to create Receiver instance
  static createReceiver(name: string, phoneNumber: string): Receiver {
    if (!name || !phoneNumber) {
      throw new Error('Both name and phone number are required');
    }
    const receiver = new Receiver();
    receiver.name = name;
    receiver.phoneNumber = phoneNumber;

    return receiver;
  }
}
