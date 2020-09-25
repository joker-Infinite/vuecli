module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  pluginOptions: {
    express: {
      shouldServeApp: true,
      serverDir: './srv'
    },
    redisDeploy: {
      registry: undefined,
      pluginVersion: '0.0.1'
    }
  }
}
