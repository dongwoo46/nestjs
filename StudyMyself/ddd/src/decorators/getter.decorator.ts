// getter.decorator.ts
export function Getter(): ClassDecorator {
  return function (target: Function) {
    const properties = Object.getOwnPropertyNames(target.prototype);

    for (const property of properties) {
      if (property === 'constructor') continue; // constructor는 제외

      const getterMethodName = `get${property.charAt(0).toUpperCase() + property.slice(1)}`;
      const privatePropertyKey = `_${property}`;

      Object.defineProperty(target.prototype, privatePropertyKey, {
        writable: true,
        enumerable: false,
      });

      Object.defineProperty(target.prototype, getterMethodName, {
        value: function () {
          return this[privatePropertyKey];
        },
        enumerable: false,
      });

      Object.defineProperty(target.prototype, property, {
        set: function (value: any) {
          this[privatePropertyKey] = value;
        },
        enumerable: true,
      });
    }
  };
}
