module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "node": true,
    },
    "rules": {
        "indent": [2, 4, {"SwitchCase": 1}],
        "comma-dangle": [2, "only-multiline"],
        "no-console": 0,
        "no-unused-vars": 0,
        "no-script-url": 0,
        "quote-props": 0,
        "arrow-parens": 0,
        "no-plusplus": [2, {"allowForLoopAfterthoughts": true}],
        "object-curly-spacing": [0, "never"],
        "react/no-array-index-key": 0,
        "react/jsx-indent-props": [2, 'space'|4],
        "react/jsx-indent": [2, 'space'|4],
        "jsx-a11y/no-static-element-interactions": 0,
    }
}
