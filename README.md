# [auto-sync-export]

[![NPM version](https://img.shields.io/npm/v/auto-sync-export?color=a1b858&label=)](https://www.npmjs.com/package/auto-sync-export)

## usage
when save document in `a.{ts,js,jsx,tsx}`, find `export` and copy to `./index.{ts,js,jsx,tsx}`.

let's say we have file named `a.ts`
``` typescript
// a.ts
const foo = 1;
const bar = 2;
export default foo;
export { bar };
```
`./index.{ts,js,jsx,tsx}` will change synchronously.
``` typescript
export { default as foo } from './a';
export { bar } from './a';
```

supported list
- `.jsx` `.tsx` `.jx` `.ts` extensions
- named exports only


TODO LIST
- [ ] test case for parser
- [ ] more strict logic for adding export to `index.{ts,js,jsx,tsx}`
- [ ] chore

## License

[MIT](./LICENSE) License © 2022 [ShaolinWang](https://github.com/ShaolinWang)
