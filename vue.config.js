const path = require('path')
// const vConsolePlugin = require('vconsole-webpack-plugin') // 引入 移动端模拟开发者工具 插件 （另：https://github.com/liriliri/eruda）
// const baseUrl = process.env.NODE_ENV === 'production' ? '/static/' : '/' // font scss资源路径 不同环境切换控制
const resolve = (dir) => path.join(__dirname, './', dir)
module.exports = {
  // 基本路径
  // publicPath: process.env.BASE_URL, // vue-cli3.3+新版本使用
  publicPath: './', // vue-cli3.3+新版本使用
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 以多页模式构建应用程序。
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: false,
  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
  parallel: require('os').cpus().length > 1,
  // 生产环境是否生成 sourceMap 文件，一般情况不建议打开
  productionSourceMap: false,
  // webpack配置
  // 调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
  configureWebpack: config => {

  },
  // webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
  devServer: {
    // host: 'localhost',
    host: '192.168.1.106',
    port: 8088, // 端口号
    https: true, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器  http://172.11.11.22:8888/rest/XX/
    hotOnly: true, // 热更新
    hot: true,
    disableHostCheck: true,
    // proxy: 'http://localhost:8000'   // 配置跨域处理,只有一个代理
    proxy: {
      [process.env.VUE_APP_API]: {
        // target: 'http://10.0.0.218:6014/ishop',
        target: 'https://test.koudailingqian.com/esbtest', // 测试环境
        // target: 'https://quasi.koudailingqian.com/ishop',//准生产环境
        // target: 'https://zswl.koudailingqian.com/miniapp', // 生产环境
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          ['^' + process.env.VUE_APP_API]: ''
        }
      },
      [process.env.VUE_APP_API_XXX]: {
        // target: 'http://10.0.0.32:8083/gatewayThree',//开发环境
        target: 'https://www.koudailingqian.com/bankapi', // 测试环境
        // target: 'https://quasi.koudailingqian.com/',//准生产环境
        // target: 'www.koudailingqian.com/', // 生产环境
        changeOrigin: true,
        secure: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_API_XXX]: ''
        }
      }
    }
  },

  chainWebpack: config => {
    // 处理路径别名
    config.resolve.alias
      .set('@', resolve('/src'))

    // 处理 svg 的配置
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
  },
  css: {
    // 启用 CSS modules
    requireModuleExtension: true,
    // 是否使用css分离插件
    extract: false,
    // 开启 CSS source maps，一般不建议开启
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 100, // 换算的基数
            unitPrecision: 5,
            propList: ['*'],
            minPixelValue: 0
          })
        ]
      }
    }
  }
}
