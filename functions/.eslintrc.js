module.exports = {
  root: true,
  env: {
    node: true,
    es6: true, // ✅ Ensures ES6 syntax is supported
  },
  parserOptions: {
    ecmaVersion: 2020, // ✅ Allows modern JavaScript syntax
    sourceType: "module",
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "max-len": "off", // Disable the max-len rule
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "no-console": "off",
    "object-curly-spacing": ["error", "always"],
  },
};
