module.exports = {
   extends: ['@commitlint/config-conventional'] ,
   plugins: ['commitlint-plugin-function-rules'],
   rules: {
      'header-case': [ 0 ],
      'body-max-line-length': [0],  // level: disabled
      'function-rules/header-case': [
         2, // level: error
         'always',
         () => {
            // I do not care about case in header
            return [true];
         }
      ],
      // Why twice ??
      "header-max-length": [0, "always", 150],
      'function-rules/header-max-length': [
         2, // level: error
         'always',
         () => {
            // The default: 100 is too short
            return [150];
         }
      ],
      'body-case': [ 0 ],
      'function-rules/body-case': [
         2, // level: error
         'always',
         () => {
            // I do not care about case in body
            return [true];
         }
      ],
      'subject-case': [ 0 ],
      'function-rules/subject-case': [
         2, // level: error
         'always',
         () => {
            // I do not care about case in subject
            return [true];
         }
      ]
   }
};
