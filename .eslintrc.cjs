/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: ["plugin:vue/vue3-essential", "prettier", "prettier/vue"],
  env: {
    "vue/setup-compiler-macros": true,
  },
};
