import { Semigroup } from "./semigroup"

// The monoid is defined by three properties
//
// - The closure property, `a -> a -> a`, which is checked by the type system
// - The associativity property, `(a + b) + c == a + (b + c)`, which cannot
// be checked by the type system and must be verified by the tests
// - The left and right identities, `empty + a = a = a + empty`, which cannot
// be checked by the type system and must be verified by the tests
export interface Monoid<A> extends Semigroup<A> {
  identity: A
}

// Freebie, monoid instances for booleans over && and ||


// The monoid over booleans using ||
//
// Booleans form a monoid with the || as the operator and false as the
// identity
//
// - Associativity: (true || false) || false = true = true || (false || false)
// - Left identity: false || true = true
// - Right identity: true || false = true
export const anyMonoid: Monoid<boolean> = {
  add: (a: boolean, b: boolean) => a || b,
  identity: false
}

// The monoid over booleans using &&
//
// Booleans form a monoid with the && as the operator and true as the
// identity
//
// - Associativity: (true && false) && false = false = true && (false && false)
// - Left identity: true && false = false
// - Right identity: false && true = false
export const allMonoid: Monoid<boolean> = {
  add: (a: boolean, b: boolean) => a && b,
  identity: true
}

// End of freebies

// Your work starts from here

// Monoid over strings, string concatenation
//
// Just like with the semigroup instance, the monoid instance for strings is
// the string concatenation, but what is the identity element?
export const stringMonoid: Monoid<string> = {
  add: (a: string, b: string) => "",
  identity: ""
}

// There are two valid monoid instances for numbers, addition and
// multiplication. Obviously one is adding values 5+10 and the other is
// multiplying values 5*10, but what are their identities?

// Monoid over numbers, behavior addition, 1+2
export const sumMonoid: Monoid<number> = {
  add: (a: number, b: number) => 0,
  identity: 0
}

// Monoid over numbers, behavior multiplication, 1*2
export const productMonoid: Monoid<number> = {
  add: (a: number, b: number) => 0,
  identity: 0
}

// There are two monoid instances for comparison, minimum and maximum.
// Obviously Math.max(1,2) == 2, but what is the identity element?

// Monoid over comparison, the minimum value
export const minMonoid: Monoid<null | number> = {
  add: (a, b) => {
    return null
  },
  identity: null
}

// Monoid over comparison, the maximum value
export const maxMonoid: Monoid<null | number> = {
  add: (a, b) => {
    return null
  },
  identity: null
}

// Monoid over key-value pairs. This is the most complex monoid you will be
// implementing.
//
// Consider the behavior of key-value pairs:
//
// - introduce new keys: {"foo": "bar"} + {"hello": "world"} = {"foo": "bar", "hello": "world"}
// - combine values: {"foo": 1} + {"foo": 2} = {"foo": 3}
//
// Since this is the most complex implementation, I'll give some extra hints
// for the implementation:
//
// - Oject.entries(a) returns a list of tuples for a record:
// Object.entries({"foo": 1}) = [ ["foo", 1] ]
// - The provided valueMapper is used to define how to compose the values
// - See the documentation for `new Map()` and the class methods
export function keyvalueMonoid<V>(valueMapper: Semigroup<V>): Monoid<Record<string | number | symbol, V>> {
  return {
    add: (a, b) => {
      return {}
    },
    identity: {}
  }
}

// See first the explanation to the `sfold` in the semigroups file
//
// The fold fully encapsulates consuming an array of monoidal values. Only
// the monoid instance and the array of values is required to consume the
// list with different behaviors.
//
// fold(stringMonoid, ["hello", " " ,"world"]) == "hello world"
// fold(minMonoid, [3,2,4,1]) == 1
// fold(allMonoid, [true, false, true]) == false
export const fold = <A>(monoid: Monoid<A>, xs: Array<A>): A =>
  monoid.identity

// The foldMap makes the venerable fold even more useful by allowing one to
// map the input array values into a monoid in a single pass. It allows one
// to consume a list of any kind with many different behaviors by mapping to
// different monoids.
export const foldMap = <A, B>(f: (x: B) => A, monoid: Monoid<A>, xs: Array<B>): A =>
  monoid.identity
