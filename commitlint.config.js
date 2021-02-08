module.exports = {
   extends: ['@commitlint/config-conventional'] ,
   plugins: ['commitlint-plugin-function-rules'],
   rules: {
      'header-case': [ 0 ],
      'function-rules/header-case': [
         2, // level: error
         'always',
         () => {
            // I do not care about case in header
            return [true];
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
