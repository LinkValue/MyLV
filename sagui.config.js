const { DefinePlugin, IgnorePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const { util } = require('config')

const { lvconnect: { appId, endpoint }, front } = util.loadFileConfigs(path.join(__dirname, 'config'))

/**
 * Sagui configuration object
 * see: http://sagui.js.org/
 */
module.exports = {
  pages: ['index'],
  develop: {
    proxy: {
      '/api/*': 'http://localhost:8001',
    },
  },
  webpack: {
    output: {
      publicPath: '/',
    },
    plugins: [
      ...(process.env.NODE_ENV !== 'dev' ? [new IgnorePlugin(/punycode/)] : []),
      new CopyWebpackPlugin([{
        from: path.resolve(__dirname, 'src/{manifest.json,favicon.ico}'),
        to: path.resolve(__dirname, 'dist'),
      }, {
        from: path.resolve(__dirname, 'src/app/assets'),
        to: path.resolve(__dirname, 'dist/assets'),
      }]),
      new DefinePlugin({
        'process.env.NODE_ENV': `"${process.env.NODE_ENV !== 'dev' ? 'production' : 'dev'}"`,
        'process.env.APP_ID': `"${appId}"`,
        'process.env.LVCONNECT_ENDPOINT': `"${endpoint}"`,
        'process.env.CONFIG': JSON.stringify(front),
      }),
    ],
  },
}
