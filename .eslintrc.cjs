// .eslintrc.cjs
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parser: "@babel/eslint-parser",
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["react", "react-hooks", "import", "unicorn"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:unicorn/recommended",
    "prettier"
  ],
  settings: { react: { version: "detect" } },
  rules: {
    "react/react-in-jsx-scope": "off",
    "unicorn/prevent-abbreviations": "off",
    "import/no-unresolved": ["error", { commonjs: true, amd: true }],
    "import/no-named-as-default": "off",
    "no-console": "warn",
    "react/prop-types": "off"
  },
};
