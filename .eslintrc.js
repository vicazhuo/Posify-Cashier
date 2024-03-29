// module.exports = {
//   root: true,
//   env: {
//     node: true
//   },
//   'extends': [
//     'plugin:vue/essential',
//     // '@vue/standard'
//   ],
//   rules: {
//     "semi": [0],
//     'indent': 'off',
//     'vue/script-indent': [
//       'error',
//       4,
//       {
//         'baseIndent': 1
//       }
//     ],
//     'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'vue/no-parsing-error': [
//       2,
//       {
//         "x-invalid-end-tag": false
//       }
//     ]
//   },
//   parserOptions: {
//     parser: 'babel-eslint'
//   }
// }
module.exports = {
    "plugins": ["prettier"],
    // "rules": {
    //     "prettier/prettier": "error"
    // },
    parserOptions: {
        parser: "babel-eslint",
        ecmaVersion: 2021,
        sourceType: "module",
    }
}
