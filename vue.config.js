module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: '/', // 设置打包文件相对路径
  devServer: {
    host: '192.168.0.104',
    port: 8071,
    open: true,
    proxy: {
      '/api': {
        target: 'http://www.baidu.com/', // 对应自己的接口
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
