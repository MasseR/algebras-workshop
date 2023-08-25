import * as monoid from "./monoid"
import fc from "fast-check"
import { isEqual } from "lodash"

// Common set of properties for a monoid instance
//
// - A monoid should satisfy the closure property, tested by the type checker
// - A monoid should satisfy the associativity property, tested by the common
// set of properties
// - A monoid should satisfy the left and right identities, tested by the
// common set of properties
const properties = <A>(name: string, monoid: monoid.Monoid<A>, genVal: fc.Arbitrary<A>) => describe(`Monoid properties for ${name}`, () => {
  it("should satisfy the associativity property", () => {
    fc.assert(fc.property(genVal, genVal, genVal, (a, b, c) => {
      const wanted = monoid.add(monoid.add(a, b), c)
      const got = monoid.add(a, monoid.add(b, c))
      if (!isEqual(wanted, got)) {
        throw new Error(`${JSON.stringify(wanted)} != ${JSON.stringify(got)}`)
      }
    }))
  })

  it("should satisfy the left identity property", () => {
    fc.assert(fc.property(genVal, (a) => {
      const wanted = a
      const got = monoid.add(monoid.identity, a)
      if (!isEqual(wanted, got)) {
        throw new Error(`${JSON.stringify(wanted)} != ${JSON.stringify(got)}`)
      }
    }))
  })

  it("should satisfy the right identity property", () => {
    fc.assert(fc.property(genVal, (a) => {
      const wanted = a
      const got = monoid.add(a, monoid.identity)
      if (!isEqual(wanted, got)) {
        throw new Error(`${JSON.stringify(wanted)} != ${JSON.stringify(got)}`)
      }
    }))
  })

})

describe("Monoid tests", () => {
  const genRecord = fc.dictionary(fc.string(), fc.string())

  properties("all", monoid.allMonoid, fc.boolean())
  describe("The behavior of all", () => {
    it("should behave like and", () => {
      expect(monoid.allMonoid.add(true, true)).toBe(true)
      expect(monoid.allMonoid.add(false, true)).toBe(false)
      expect(monoid.allMonoid.add(true, false)).toBe(false)
      expect(monoid.allMonoid.add(false, false)).toBe(false)
    })
  })

  properties("any", monoid.anyMonoid, fc.boolean())
  describe("The behavior of any", () => {
    it("should behave like or", () => {
      expect(monoid.anyMonoid.add(true, true)).toBe(true)
      expect(monoid.anyMonoid.add(false, true)).toBe(true)
      expect(monoid.anyMonoid.add(true, false)).toBe(true)
      expect(monoid.anyMonoid.add(false, false)).toBe(false)
    })
  })


  properties("key-value", monoid.keyvalueMonoid<string>(monoid.stringMonoid), genRecord)
  describe("The behavior of key-value", () => {
    it("should create new keys", () => {
      expect(monoid.keyvalueMonoid<string>(monoid.stringMonoid).add({ "a": "1" }, { "b": "2" })).toStrictEqual({ "a": "1", "b": "2" })
    })
    it("should combine values using the provided semigroup", () => {
      expect(monoid.keyvalueMonoid<string>(monoid.stringMonoid).add({ "a": "hello " }, { "a": "world" })).toStrictEqual({ "a": "hello world" })
    })
  })


  properties("strings", monoid.stringMonoid, fc.string())
  describe("The behavior of string concatenation", () => {
    it("should concatenate strings", () => {
      expect(monoid.stringMonoid.add("a", "b")).toBe("ab")
    })
  })

  properties("sum", monoid.sumMonoid, fc.integer())
  describe("The behavior of sum", () => {
    it("should select the sum of two values", () => {
      expect(monoid.sumMonoid.add(1, 2)).toBe(3)
    })
  })

  // Have to artificially limit the range of integers because it's easy to
  // overflow with a list of integers
  properties("product", monoid.productMonoid, fc.integer())
  describe("The behavior of product", () => {
    it("should select the product of two values", () => {
      expect(monoid.productMonoid.add(2, 2)).toBe(4)
    })
  })

  properties("min", monoid.minMonoid, fc.integer())
  describe("The behavior of min", () => {
    it("should select the minimum of two values", () => {
      expect(monoid.minMonoid.add(1, 2)).toBe(1)
    })
  })

  properties("max", monoid.maxMonoid, fc.integer())
  describe("The behavior of max", () => {
    it("should select the maximum of two values", () => {
      expect(monoid.maxMonoid.add(1, 2)).toBe(2)
    })
  })

  describe("Folding on monoids", () => {
    it("should fold in the correct order", () => {
      fc.assert(fc.property(fc.array(fc.string()), (as) => {
        const m = monoid.stringMonoid
        const got = monoid.fold(m, as)
        const wanted = as.reduceRight((acc: string, x: string) => m.add(x, acc), m.identity)
        if (!isEqual(got, wanted)) {
          throw new Error(`${JSON.stringify(wanted)} != ${JSON.stringify(got)}`)
        }
      }))
    })

    it("foldMap id should be equivalent to fold", () => {
      fc.assert(fc.property(fc.array(fc.string()), (as) => {
        const m = monoid.stringMonoid
        const got = monoid.foldMap((a) => a, m, as)
        const wanted = monoid.fold(m, as)
        if (!isEqual(got, wanted)) {
          throw new Error(`${JSON.stringify(wanted)} != ${JSON.stringify(got)}`)
        }
      }))
    })
  })
})
