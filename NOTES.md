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

### Order of mapping matters
```js
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy', // does the proxy for us
    '\\.css$': '<rootDir>/test/__mocks__/style-mock.js',
  },
```
if `css` rules comes before `module.css` rule, the `module.css` rule will no longer be effective, since they all would have gotten matched and handled by the first rule.

## JavaScript String Escaping

When writing regex patterns in JavaScript strings, backslashes need to be escaped:

```js
'\\.css'
```

This has **two layers** of escaping:
1. JavaScript string layer: `\\` (two backslashes) → becomes `\` (one backslash)
2. Regex layer: `\.` (backslash-dot) → means "literal dot character"

So `'\\.css'` in code becomes the string value `\.css`, which regex interprets as "literal dot followed by css".

A single backslash `\` in a string is incomplete — it's waiting for the next character to form an escape sequence:
- `\\` → one backslash
- `\n` → newline
- `\t` → tab
- `\'` → literal quote
- `\` alone → ❌ SyntaxError

### Breaking down `'\\.css$'`

The moduleNameMapper pattern `'\\.css$'` has three regex components:

| Pattern | What it means | Why |
|---------|---------------|-----|
| `\\.` | Literal dot character `.` | In regex, `.` matches any char, so `\.` escapes it to mean "literal dot". The `\\` is needed because JS strings also use `\` as escape. |
| `css` | Literal text "css" | No escaping needed, matches exactly "css" |
| `$` | End of string anchor | Matches the end of the filename, ensures `.css` is at the end |

**Examples of what matches `\\.css$`:**
```
button.css           ✓ (ends with .css)
styles.css           ✓ (ends with .css)
global.css           ✓ (ends with .css)
button.module.css    ✓ (ALSO ends with .css)
button               ❌ (doesn't end with .css)
```

**Why order matters:** Both `\\.module\\.css$` and `\\.css$` match `button.module.css`. Jest uses the first matching rule, so `\\.module\\.css$` must come first to handle CSS modules specifically. If `\\.css$` came first, it would catch CSS modules too and the module rule would never apply. 