export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [
      2,
      'always',
      ['ai', 'code', 'common', 'dependencies', 'env', 'main', 'tooling', 'workflow']
    ],
    'scope-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'type-case': [2, 'always', 'lower-case']
  }
}
