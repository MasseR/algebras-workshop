import * as semigroup from "./semigroup"
import fc from "fast-check"
import {isEqual} from "lodash"

// Common set of properties for a semigroup instance
//
// - A semigroup should satisfy the closure property, tested by the type
// checker
// - A semigroup should satisfy the associativity property, tested by the
// common set of properties
//
// The test generator takes the name of the instance, such as 'strings', the
// semigroup instance and a test generator for the given type.
const properties = <A>(name: string, semigroup: semigroup.Semigroup<A>, genVal: fc.Arbitrary<A>) =>
  describe(`Semigroup properties for ${name}`, () => {
    it("should satisfy the associativity property", () => {
      fc.assert(fc.property(genVal, genVal, genVal, (a, b, c) => {
        const left = semigroup.add(semigroup.add(a, b), c)
        const right = semigroup.add(a, semigroup.add(b, c))
        if (!isEqual(left, right)) {
          throw new Error(`${JSON.stringify(left)} != ${JSON.stringify(right)}`)
        }
      }))
    })
  })

describe("Semigroup tests", () => {
  // Test the strings instance. The properties test that it's a valid
  // semigroup, satisfying the semigroup properties, while the manual test is
  // accompanying the properties
  properties("strings", semigroup.stringSemigroup, fc.string())
  describe("The behavior of string concatenation", () => {
    it("should concatenate strings", () => {
      expect(semigroup.stringSemigroup.add("a", "b")).toBe("ab")
    })
  })


  // Test the min and max semigroup instances. The properties test that they
  // are valid semigroups, satisfying the semigroup properties, while the
  // manual test is accompanying the properties testing specific examples.
  properties("min", semigroup.minSemigroup, fc.integer())
  describe("The behavior of min", () => {
    it("should select the minimum of two values", () => {
      expect(semigroup.minSemigroup.add(1, 2)).toBe(1)
    })
  })
  properties("max", semigroup.maxSemigroup, fc.integer())
  describe("The behavior of max", () => {
    it("should select the maximum of two values", () => {
      expect(semigroup.maxSemigroup.add(1, 2)).toBe(2)
    })
  })

  // Test the all and and semigroup instances. The properties test that they
  // are valid semigroups, satisfying the semigroup properties, while the
  // manual test is accompanying the properties testing specific examples.
  //
  // In the case of boolean algebra we can actually iterate through all the
  // possibilities to get 100% test coverage.
  properties("all", semigroup.allSemigroup, fc.boolean())
  describe("The behavior of all", () => {
    it("should behave like and", () => {
      expect(semigroup.allSemigroup.add(true, true)).toBe(true)
      expect(semigroup.allSemigroup.add(false, true)).toBe(false)
      expect(semigroup.allSemigroup.add(true, false)).toBe(false)
      expect(semigroup.allSemigroup.add(false, false)).toBe(false)
    })
  })
  properties("any", semigroup.anySemigroup, fc.boolean())
  describe("The behavior of any", () => {
    it("should behave like or", () => {
      expect(semigroup.anySemigroup.add(true, true)).toBe(true)
      expect(semigroup.anySemigroup.add(false, true)).toBe(true)
      expect(semigroup.anySemigroup.add(true, false)).toBe(true)
      expect(semigroup.anySemigroup.add(false, false)).toBe(false)
    })
  })

  describe("Folding with semigroups using the string instance", () => {
    it("should concatenate strings", () => {
      expect(semigroup.sfold(semigroup.stringSemigroup, "a", ["b", "c", "d"])).toBe("abcd")
    })
  })
})
