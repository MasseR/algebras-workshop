# Algebras workshop

This is the coding section of the workshop. Your task is to write the monoid
instances in the `monoid.ts`. You have one hour to do as much as you can. Feel
free to pair up or create small groups.

There are three parts to the repository:

```
├── magma
│   └── magma.ts
├── semigroup
│   ├── semigroup.ts
│   └── semigroup.test.ts
└── monoid
    ├── monoid.ts
    └── monoid.test.ts
```

## Magmas

The `magma.ts` contains the definition of a magma, but since it doesn't have a
lot of properties it's applicability is not that great. It's there as a minimal
example.

## Semigroups

The `semigroup.ts` contains a definition of a semigroup as well as a number of
semigroup instances. These are all valid, complete instances passing the tests
defined in the `semigroup.test.ts`. Use these for help and guidance for
implementing the monoid instances.

## Monoids

The `monoid.ts` contains a definition of a monoid as well as a number of
placeholders for the monoid instances. The tests for the instances are in the
`monoid.test.ts`.

Your task is to finish writing the monoid instances. Use whatever help you need, ask questions.

# Running

1. Clone the repository
2. Nix users, open a nix shell `nix develop -c $SHELL`, others make sure node
   and npm are installed
3. Run `npm install`
4. Run `npx jest`
