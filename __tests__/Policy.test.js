// @flow

import * as P from '../Policy'
import * as Monoid from 'flow-static-land/lib/Monoid'

test('Sound Policy', () => {

  const ownersCanEdit = P.makePolicy('Owner', 'Edit')
  const contributersCanView = P.makePolicy('Contributor', 'View')
  const policy = Monoid.concatAll(P.PolicyMonoid, [ownersCanEdit, contributersCanView])

  expect(P.can('Owner', 'Edit', policy)).toBe(true)
  expect(P.can('Contributor', 'Edit', policy)).toBe(false)
  expect(P.can('Contributor', 'View', policy)).toBe(true)
  expect(P.can('Public', 'Edit', policy)).toBe(false)
})

test('Nonsense Policy should automatically get corrected', () => {
  const policy = Monoid.concatAll(P.PolicyMonoid, [
    P.makePolicy('Owner', 'None'),
    P.makePolicy('Public', 'Edit')
  ])

  expect(P.can('Owner', 'Edit', policy)).toBe(true)
  expect(P.can('Contributor', 'Edit', policy)).toBe(true)
  expect(P.can('Contributor', 'View', policy)).toBe(true)
  expect(P.can('Public', 'Edit', policy)).toBe(true)

})
