// utils/autoPopulatePlugin.js
export const  autoPopulatePlugin =(paths = []) => {
  return function (schema) {
    const hooks = ["find", "findOne", "findById"];
    const autoPopulate = function (next) {
      paths.forEach((p) => this.populate(p));
      next();
    };
    hooks.forEach((hook) => schema.pre(hook, autoPopulate));
  };
}
