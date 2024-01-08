module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  plugins: ["node"],
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:node/recommended",
    "prettier",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    quotes: "off",
    "no-console": "off",
    "import/no-extraneous-dependencies": "off",
    "consistent-return": "off",
    "no-underscore-dangle": "off",
    "func-names": "off",
    "no-await-in-loop": "off",
    "no-restricted-syntax": "off",
    "node/no-unsupported-features/es-syntax": [
      "error",
      {
        version: ">=8.3.0",
        ignores: [],
      },
    ],
  },
};
