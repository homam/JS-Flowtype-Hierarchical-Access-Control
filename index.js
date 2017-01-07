// @flow

import * as P from './Policy'
import * as Monoid from 'flow-static-land/lib/Monoid'

const ownersCanEdit = P.makePolicy('Owner', 'Edit')
const contributersCanView = P.makePolicy('Contributor', 'View')
const myPolicy = Monoid.concatAll(P.PolicyMonoid, [ownersCanEdit, contributersCanView])


console.log('Can Owner Edit?', P.can('Owner', 'Edit', myPolicy))
console.log('Can Contributer Edit?', P.can('Contributor', 'Edit', myPolicy))
console.log('Can Public Edit?', P.can('Public', 'Edit', myPolicy))

console.log('----')

const nonsensePolicy = Monoid.concatAll(P.PolicyMonoid, [
  P.makePolicy('Owner', 'None'),
  P.makePolicy('Public', 'Edit')
])

console.log('Can Owner Edit?', P.can('Owner', 'Edit', nonsensePolicy))
console.log('Can Contributer Edit?', P.can('Contributor', 'Edit', nonsensePolicy))
console.log('Can Public Edit?', P.can('Public', 'Edit', nonsensePolicy))
