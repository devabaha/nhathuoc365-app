/**
 * An aggregation for classes to pretend multiple inheritance effect.
 *
 * @method
 * @todo Mix all {mixins} to {baseClass} by copying
 *
 * @param {Class} baseClass - base/root class able to be extended
 * @param  {...Class} mixins - classes will be mixed into baseClass
 * @returns {Class} - an properties combined class
 */
export const aggregation = (baseClass, ...mixins) => {
  /**
   * An class created by {baseClass}
   *
   * @class
   */
  let base = class _Combined extends baseClass {
    constructor(...args) {
      super(...args);
    }
  };

  /**
   * @method
   * @todo copy all prototypes of {source} to {target} class.
   * @todo ignore some base prototype.
   *
   * @param {Class} target
   * @param {Class} source
   */
  let copyProps = (target, source) => {
    Object.getOwnPropertyNames(source)
      .concat(Object.getOwnPropertySymbols(source))
      .forEach(prop => {
        if (
          prop.match(
            /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/
          )
        )
          return;
        Object.defineProperty(
          target,
          prop,
          Object.getOwnPropertyDescriptor(source, prop)
        );
      });
  };

  /**
   * @todo copy deeply prototype of every class in {mixins} to {baseClass}
   */
  mixins.forEach(mixin => {
    copyProps(base.prototype, mixin.prototype);
    copyProps(base, mixin);
  });

  return base;
};
