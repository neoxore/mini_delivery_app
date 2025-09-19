import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function Match<T = any>(property: keyof T, options?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: { message: 'Passwords must match', ...options },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [related] = args.constraints;
          return value === (args.object as any)[related];
        },
      },
    });
  };
}
