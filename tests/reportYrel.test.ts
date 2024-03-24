import { test, expect } from 'vitest'
import { y, validateYrel, reportYrel } from '../'

test('Should report custom errors in validations', () => {
  const schema = y.string().validate(
    (value) =>
      value.length > 10 ||
      reportYrel({
        errors: [['err_custom', 'invalid_string']],
        children: [
          { key: 'child1', errors: [['err_custom', 'invalid1']] },
          { key: 'child2', errors: [['err_custom', 'invalid2']] }
        ]
      })
  )
  const received = validateYrel(schema, 'abc')
  const expected = {
    isValid: false,
    issues: [
      { key: '', errors: [['err_custom', 'invalid_string']] },
      { key: 'child1', errors: [['err_custom', 'invalid1']] },
      { key: 'child2', errors: [['err_custom', 'invalid2']] }
    ],
    data: undefined
  }
  expect(received).toEqual(expected)
})

test('Should report custom errors in validations with multiple nested keys', () => {
  const schema = y.object({
    users: y
      .object({
        name: y.string().validate(
          (value) =>
            value.length > 10 ||
            reportYrel({
              errors: [['err_custom', 'invalid_name']],
              children: [{ key: 'child', errors: [['err_custom', 'invalid_name_child']] }]
            })
        ),
        age: y.number().lt(0)
      })
      .validate(
        (value) =>
          value.age > 5 ||
          reportYrel({
            errors: [['err_custom', 'invalid_children']],
            children: [
              {
                key: 'age',
                errors: [['err_number_gt', { gt: 5 }]]
              },
              {
                key: 'name.child',
                errors: [['err_custom', 'invalid_name_with_age']]
              }
            ]
          })
      )
  })

  const received = validateYrel(schema, {
    users: {
      name: 'a',
      age: 1
    }
  })
  const expected = {
    isValid: false,
    issues: [
      { key: 'users', errors: [['err_custom', 'invalid_children']] },
      { key: 'users.name', errors: [['err_custom', 'invalid_name']] },
      {
        key: 'users.name.child',
        errors: [
          ['err_custom', 'invalid_name_child'],
          ['err_custom', 'invalid_name_with_age']
        ]
      },
      {
        key: 'users.age',
        errors: [
          ['err_number_lt', { lt: 0 }],
          ['err_number_gt', { gt: 5 }]
        ]
      }
    ],
    data: undefined
  }
  expect(received).toEqual(expected)
})
