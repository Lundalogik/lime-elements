var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Use this!
 * @param {DecoratorConfig} _config how to use it
 * @returns {ClassDecorator} the decorator
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CustomDecorator = (_config) => {
  return () => { };
};
/**
 * The colors
 */
export var Color;
(function (Color) {
  /**
   * The red color
   */
  Color["Red"] = "red";
  /**
   * Looks like green
   */
  Color["Green"] = "green";
  /**
   * Almost blue
   */
  Color["Blue"] = "blue";
})(Color || (Color = {}));
/**
 * The Zap class
 * @deprecated
 */
let Zap = class Zap {
};
Zap = __decorate([
  CustomDecorator({ name: 'gg' })
], Zap);
export { Zap };
