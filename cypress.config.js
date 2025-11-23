const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    env: {
      apiUrl: 'http://localhost:8081',
    },
    setupNodeEvents(on, config) {
      return config
    },
  },
})
