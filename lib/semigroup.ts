import { Magma } from "./magma"

// See also the semigroup.test.ts

// The semigroup is defined by two properties
// - The closure property, `a -> a -> a`, which is checked by the type system
// - The associativity property, `(a + b) + c == a + (b + c)`, which cannot
// be checked by the type system and must be verified by the tests
//
// Note for typography, the binary operation is called `add` which I'm
// shortening to `+` in the comments. Make sure to replace `+` with whatever
// the instance behavior should be.
export interface Semigroup<A> extends Magma<A> { }

// Folding, or reducing, is a way of consuming a list or array of values into
// a single value. The fold traverses through every element in the list,
// combining the current visited value with the running state or accumulator.
//
// This `sfold` function uses the semigroup instance to abstract away the
// composition. You can change the behavior of the fold by changing the
// semigroup instance. You can for example concatenate strings together by
// using the `stringSemigroup`, or find the minimum value of a list by using
// `minSemigroup` or test if all the values are true with `allSemigroup`.
//
// However, the semigroup does not include anything for the initial value so
// it has to be provided explicitly.
export const sfold = <A>(semigroup: Semigroup<A>, init: A, xs: Array<A>): A =>
  xs.reduce((a, b) => semigroup.add(a, b), init)

// The semigroup instance for strings, which is just string concatenation.
// For example "hello " + "world" = "hello world"
//
// The addition should be associative, i.e. ("hello" + " ") + "world" =
// "hello world" = "hello" + (" " + "world")
export const stringSemigroup: Semigroup<string> = {
  add: (a, b) => a + b
}

// The semigroup instance for finding the minimum value.
//
// Does it satisfy the associativity property?
//
// 1 + (2 + 3) = 1 = (1 + 2) + 3
export const minSemigroup: Semigroup<number> = {
  add: (a, b) => a < b ? a : b
}

// The semigroup instance for finding the maximum value.
//
// Does it satisfy the associativity property?
//
// 1 + (2 + 3) = 3 = 1 + (2 + 3)
export const maxSemigroup: Semigroup<number> = {
  add: (a, b) => a > b ? a : b
}

// The semigroup instance for &&.
//
// Does it satisfy the associativity property?
//
// true + (false + true) = false = (true + false) + true
export const allSemigroup: Semigroup<boolean> = {
  add: (a, b) => a && b
}

// The semigroup instance for ||.
//
// Does it satisfy the associativity property?
//
// true + (false + true) = true = (true + false) + true
export const anySemigroup: Semigroup<boolean> = {
  add: (a, b) => a || b
}
