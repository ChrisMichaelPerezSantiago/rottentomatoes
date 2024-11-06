// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    rules: {
      'ts/explicit-function-return-type': 'warn', // Disable this rule
      'no-prototype-builtins': 'warn', // Disable this rule
      'unused-imports/no-unused-vars': 'warn', // Disable this rule
    },
  },
)
