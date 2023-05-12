const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true
})
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://158.160.36.229:8081',
                changeOrigin: true
            }
        }
    }
}