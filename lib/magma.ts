// Magma is the simplest algebraic structure we're seeing this time. Remember
// that the algebra is a set of operations on a type, which in the case of a
// magma is a binary operation I'm calling 'add'.
//
// The only property the magma has is the closure property which is already
// checked by the compiler, so there is no need for having a test in place.
export interface Magma<A> {
  add: (a : A, b : A) => A
}
