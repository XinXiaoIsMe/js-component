module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "ignorePatterns": [
        ".eslintrc.js",
        "vite.config.js",
        "vite.test.js",
        "dist/**/*.js"
    ],
    "extends": [
        "@antfu"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "@typescript-eslint/comma-dangle": "off"
    }
}
