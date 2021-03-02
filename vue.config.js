const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
const appConfig = require('./config/app-config.js')

module.exports = {
  //vue-cli3.0 里面的 vue.config.js做配置
  publicPath: '/cdfz/',
  assetsDir: 'static',
  devServer: {
    proxy: {
      '/cdfz': {
        target: 'http://localhost:9091/',
        ws: true,
        changeOrigin: true,
      },
    }
  },
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')
    // 清除已有的所有 loader,如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
    svgRule.uses.clear()
    // 添加要替换的 loader
    svgRule.use('svg-sprite-loader').loader('svg-sprite-loader')
        .options({
          symbolId: 'icon-[name]'
        })
  },
  configureWebpack: {
    plugins: [
      // 生成仅包含颜色的替换样式（主题色等）
      new ThemeColorReplacer({
        fileName: 'style/theme-colors.css',
        matchColors: [
          ...forElementUI.getElementUISeries(appConfig.themeColor)
        ],
        changeSelector: forElementUI.changeSelector,
        isJsUgly: process.env.NODE_ENV === 'production' ? true : undefined
      })
    ]
  }
}