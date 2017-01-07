// @flow

import * as arr from 'flow-static-land/lib/Arr'
import * as Ord from 'flow-static-land/lib/Ord'
import * as Setoid from 'flow-static-land/lib/Setoid'
import * as Semigroup from 'flow-static-land/lib/Semigroup'
import * as Monoid from 'flow-static-land/lib/Monoid'

export const roles = {
  Public: 1,
  Contributor: 2,
  Owner: 3
}

export type Role = $Keys<typeof roles>

export const RoleSetoid : Setoid.Setoid<Role> = {
  equals: Setoid.strictEquals
}

export const RoleOrd : Ord.Ord<Role> = {...RoleSetoid,
  compare: (x: Role, y: Role) => Ord.unsafeCompare(roles[x], roles[y])
}


export const levels = {
  None: 1,
  View: 2,
  Edit: 3
}

export type Level = $Keys<typeof levels>

export const LevelSetoid : Setoid.Setoid<Level> = {
  equals: Setoid.strictEquals
}

export const LevelOrd : Ord.Ord<Level> = { ...LevelSetoid,
  compare: (x: Level, y: Level) => Ord.unsafeCompare(levels[x], levels[y])
}

// type Policy = Role => Level

class Policy {
  run : Role => Level
  constructor(f: Role => Level) {
    this.run = f
  }
}

export const PolicySemigroup : Semigroup.Semigroup<Policy> = {
  concat: (x: Policy, y: Policy) => new Policy((r: Role) => Ord.max(LevelOrd, x.run(r), y.run(r)))
}

export const PolicyMonoid : Monoid.Monoid<Policy> = { ...PolicySemigroup,
  empty: () => new Policy(_ => 'None')
}

export const makePolicy : (Role, Level) => Policy = (r, l) => new Policy(r1 =>
  Ord.greaterThanOrEq(RoleOrd, r1, r) ? l : 'None')

export const can : (Role, Level, Policy) => boolean = (r, l, p) => Ord.greaterThanOrEq(LevelOrd, p.run(r), l)
