export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [2, 'always', ['ai', 'code', 'dependencies', 'env', 'tooling', 'workflow']],
    'scope-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lower-case'],
    'type-case': [2, 'always', 'lower-case']
  }
}
