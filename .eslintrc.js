module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    jquery: true,
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:json/recommended",
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
  },
  globals: {
    Foundation: true,
  },
};
