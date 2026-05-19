# My learnings 

## Handling CSS Files

**Webpack transforms CSS** (via loaders like style-loader and css-loader). **Jest imports but can't evaluate CSS** (it's not JavaScript). So we **mock** CSS imports.

When we are **testing**, **Jest** doesn't use webpack. Instead, Jest tries to **import** CSS files, but it can't **evaluate** them as JavaScript, which causes an error. 

So we use `moduleNameMapper` in `jest.config.js` to **intercept** CSS imports and **redirect** them to a mock file. In this mock file, we export a Proxy wrapping an empty object that returns the property name for any access:

```js
module.exports = new Proxy(
  {},
  {get: (target, prop) => (prop === '__esModule' ? false : prop)},
)
```

This way, when code accesses `styles.button`, it gets the string `"button"` instead of `undefined`, so the code doesn't break.