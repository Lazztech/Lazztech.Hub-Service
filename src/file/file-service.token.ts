/**
 * Note: this should stay in its own file. Due to the way modules are created at runtime this
 * is needed to ensure that this token can be used within this module.
 *
 * "One final note: for simplicity we used a string-based injection token ('CONFIG_OPTIONS') above,
 * but best practice is to define it as a constant (or Symbol) in a separate file, and import that file."
 *
 * https://docs.nestjs.com/fundamentals/dynamic-modules#module-configuration
 *
 * @FILE_SERVICE Used via NestJS Inject decorator for interface based dependency injection
 * via factory provider.
 * https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory
 */
export const FILE_SERVICE = 'FileService';
