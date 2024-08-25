// auto-getter.decorator.ts
export function AutoGetter() {
  return function (target: any, propertyKey: string): void {
    const privatePropertyKey = `_${propertyKey}`;
    const getterMethodName = `get${propertyKey.charAt(0).toUpperCase() + propertyKey.slice(1)}`;

    // Private field definition
    Object.defineProperty(target, privatePropertyKey, {
      writable: true,
      enumerable: false,
    });

    // Define getter method
    Object.defineProperty(target, getterMethodName, {
      value: function () {
        return this[privatePropertyKey];
      },
      enumerable: false,
    });

    // Define setter for the original field
    Object.defineProperty(target, propertyKey, {
      set: function (value: any) {
        this[privatePropertyKey] = value;
      },
      enumerable: true,
    });
  };
}
