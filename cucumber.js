module.exports = {
  default: {
    paths: ['features/**/*.feature'],

    require: [
      'step-definitions/**/*.js'
    ],

    format: [
      'progress',
      'html:reports/cucumber-report.html',
      'allure-cucumberjs/reporter'
    ],

    formatOptions: {
      allure: {
        resultsDir: 'allure-results'
      }
    },

    requireModule: ['dotenv/config']
  }
};

