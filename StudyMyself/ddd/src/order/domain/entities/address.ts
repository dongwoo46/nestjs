import { Getter } from 'src/decorators/getter.decorator';

// address.ts
@Getter()
export class Address {
  private street: string;
  private city: string;
  private postalCode: string;

  // protected constructor to prevent direct instantiation
  protected constructor() {}

  // Factory method to create Address instance
  static createAddress(
    street: string,
    city: string,
    postalCode: string,
  ): Address {
    if (!street || !city || !postalCode) {
      throw new Error('Street, city, and postal code are all required');
    }
    const address = new Address();
    address.street = street;
    address.city = city;
    address.postalCode = postalCode;

    return address;
  }

  // // Getters
  // get getStreet(): string {
  //   return this.street;
  // }

  // get getCity(): string {
  //   return this.city;
  // }

  // get getPostalCode(): string {
  //   return this.postalCode;
  // }
}
