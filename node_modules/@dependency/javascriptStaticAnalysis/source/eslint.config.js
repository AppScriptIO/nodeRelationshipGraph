"use strict";

let typescriptEslintRecommended = require('@typescript-eslint/eslint-plugin/dist/configs/recommended.json');

let prettierTypescriptEslint = require('eslint-config-prettier/@typescript-eslint');

let prettierConfig = require('./prettier.config.js');

module.exports = ({
  babelConfigPath = './configuration/babel.config.js',
  typescriptConfigPath = './configuration/typescript.config.json'
} = {}) => {
  return {
    root: true,
    overrides: [// { // NOTE: Using VSCode builtin formatter instead
    //   files: ['**.json', '**.jsonc'],
    //   plugins: ['eslint-plugin-json'],
    // },
    {
      files: ['**.js'],
      // "excludedFiles": "*.test.js",
      parser: 'babel-eslint',
      parserOptions: {
        babelOptions: {
          configFile: babelConfigPath
        }
      },
      plugins: ['eslint-plugin-babel', // eslint-plugin-babel re-implements (from the base eslint rules) problematic rules so they do not give false positives or negatives
      'prettier'],
      rules: {
        'prettier/prettier': ['warn', prettierConfig, {
          usePrettierrc: true
        }]
      }
    }, {
      files: ['**.ts'],
      // correctly parse typescript with babel parser - https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/typescript-estree/tests/ast-alignment/parse.ts#L16
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        project: typescriptConfigPath // Follows the path should be consumed by a function and replaced.

      },
      plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
      rules: Object.assign(typescriptEslintRecommended.rules, prettierTypescriptEslint.rules, // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
      {
        'prettier/prettier': 'warn'
      })
    }],
    rules: {},
    env: {
      node: true
    }
  };
};